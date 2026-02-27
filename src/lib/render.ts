import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { supabase } from './supabase'

let ffmpeg: FFmpeg | null = null

// FFmpeg 초기화 (한 번만)
async function initFFmpeg() {
  if (ffmpeg) return ffmpeg

  ffmpeg = new FFmpeg()
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })

  return ffmpeg
}

export interface RenderJobStatus {
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number // 0-100
  estimatedTimeRemaining?: number
  videoUrl?: string
  subtitleUrl?: string
  error?: string
}

export async function startRender(projectId: string): Promise<{ jobId: string }> {
  // 1. 프로젝트 상태를 'rendering'으로 변경
  await supabase
    .from('projects')
    .update({ status: 'rendering' })
    .eq('id', projectId)

  // 2. 실제 렌더링 시작
  renderVideo(projectId)

  return { jobId: projectId }
}

async function renderVideo(projectId: string) {
  try {
    // 프로젝트 데이터 가져오기
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) throw error

    // FFmpeg 초기화
    const ffmpegInstance = await initFFmpeg()

    // 슬라이드 이미지 생성
    const slides = project.slides || []
    const imageFiles: string[] = []

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      const canvas = await createSlideImage(slide.text, i)
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((b) => resolve(b!), 'image/png')
      )
      
      const fileName = `slide${i}.png`
      await ffmpegInstance.writeFile(fileName, await fetchFile(blob))
      imageFiles.push(fileName)
    }

    // TTS 오디오 파일 준비
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      if (slide.audio_url) {
        // base64 → blob
        const audioBlob = await fetch(slide.audio_url).then(r => r.blob())
        const audioFileName = `audio${i}.mp3`
        await ffmpegInstance.writeFile(audioFileName, await fetchFile(audioBlob))
      }
    }

    // FFmpeg concat 파일 생성
    let concatContent = ''
    let currentTime = 0

    for (let i = 0; i < slides.length; i++) {
      const duration = slides[i].duration_seconds || 5
      concatContent += `file 'slide${i}.png'
`
      concatContent += `duration ${duration}
`
      currentTime += duration
    }

    await ffmpegInstance.writeFile(
      'concat.txt', 
      new TextEncoder().encode(concatContent)
    )

    // FFmpeg 명령 실행
    await ffmpegInstance.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-framerate', '1',
      '-pix_fmt', 'yuv420p',
      'output.mp4'
    ])

    // 결과 파일 읽기
    const videoData = await ffmpegInstance.readFile('output.mp4')
    const videoBlob = new Blob([videoData], { type: 'video/mp4' })

    // Supabase Storage에 업로드
    const videoFileName = `${projectId}.mp4`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(videoFileName, videoBlob, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (uploadError) throw uploadData

    // Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(videoFileName)

    // 프로젝트 상태 업데이트
    await supabase
      .from('projects')
      .update({
        status: 'completed',
        video_url: publicUrl
      })
      .eq('id', projectId)

  } catch (error) {
    console.error('Video rendering failed:', error)
    
    // 실패 상태 업데이트
    await supabase
      .from('projects')
      .update({
        status: 'failed'
      })
      .eq('id', projectId)
  }
}

// Canvas로 슬라이드 이미지 생성
async function createSlideImage(text: string, index: number): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = 1920
  canvas.height = 1080
  
  const ctx = canvas.getContext('2d')!
  
  // 배경
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 1920, 1080)
  
  // 텍스트
  ctx.fillStyle = '#000000'
  ctx.font = '48px "Pretendard", "Noto Sans KR", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 여러 줄 텍스트 처리
  const lines = text.split('
')
  const lineHeight = 60
  const startY = 540 - (lines.length * lineHeight / 2)
  
  lines.forEach((line, i) => {
    ctx.fillText(line, 960, startY + (i * lineHeight))
  })
  
  // 슬라이드 번호
  ctx.font = '24px "Pretendard", "Noto Sans KR", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`${index + 1}`, 1850, 1020)
  
  return canvas
}

export async function getRenderStatus(projectId: string): Promise<RenderJobStatus> {
  const { data: project, error } = await supabase
    .from('projects')
    .select('status, video_url, subtitle_url')
    .eq('id', projectId)
    .single()

  if (error) throw error

  const statusMap: Record<string, RenderJobStatus['status']> = {
    'draft': 'queued',
    'rendering': 'processing',
    'completed': 'completed',
    'failed': 'failed'
  }

  const progress = project.status === 'rendering' ? 50 : 
                   project.status === 'completed' ? 100 : 0

  return {
    status: statusMap[project.status] || 'queued',
    progress,
    estimatedTimeRemaining: project.status === 'rendering' ? 60 : undefined,
    videoUrl: project.video_url || undefined,
    subtitleUrl: project.subtitle_url || undefined
  }
}
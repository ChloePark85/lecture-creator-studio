import { supabase } from './supabase'

export interface RenderJobStatus {
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number // 0-100
  estimatedTimeRemaining?: number // seconds
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

  // 2. 렌더링 작업 시뮬레이션 (실제로는 백엔드 API 호출)
  // TODO: 실제 렌더링 서버로 요청 보내기
  
  // Mock: setTimeout으로 렌더링 시뮬레이션
  simulateRendering(projectId)

  return { jobId: projectId }
}

async function simulateRendering(projectId: string) {
  // 5초 후 완료로 변경 (Mock)
  setTimeout(async () => {
    // Mock 비디오 URL (실제로는 렌더링된 영상 업로드)
    const mockVideoUrl = `https://example.com/videos/${projectId}.mp4`
    const mockSubtitleUrl = `https://example.com/subtitles/${projectId}.srt`

    await supabase
      .from('projects')
      .update({
        status: 'completed',
        video_url: mockVideoUrl,
        subtitle_url: mockSubtitleUrl
      })
      .eq('id', projectId)
  }, 5000)
}

export async function getRenderStatus(projectId: string): Promise<RenderJobStatus> {
  const { data: project, error } = await supabase
    .from('projects')
    .select('status, video_url, subtitle_url')
    .eq('id', projectId)
    .single()

  if (error) throw error

  // 상태 매핑
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
    estimatedTimeRemaining: project.status === 'rendering' ? 30 : undefined,
    videoUrl: project.video_url || undefined,
    subtitleUrl: project.subtitle_url || undefined
  }
}
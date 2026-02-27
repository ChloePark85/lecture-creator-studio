import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CompletePage() {
  const { projectId } = useParams()
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    if (!projectId) return

    async function loadProject() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()
      
      setProject(data)
    }

    loadProject()
  }, [projectId])

  if (!project) return <div>로딩 중...</div>

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🎉 영상 생성 완료!</h1>
      
      {project.video_url && (
        <div className="mb-6">
          <video 
            controls 
            className="w-full rounded-lg"
            src={project.video_url}
          >
            Your browser does not support video.
          </video>
        </div>
      )}

      <div className="space-y-2">
        <p>제목: {project.title}</p>
        <p>길이: {project.duration_seconds}초</p>
        {project.video_url && (
          <a 
            href={project.video_url} 
            download={`${project.title}.mp4`}
            className="text-blue-600 hover:underline"
          >
            📥 영상 다운로드
          </a>
        )}
      </div>
    </div>
  )
}
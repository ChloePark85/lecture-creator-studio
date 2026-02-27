import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRenderStatus, type RenderJobStatus } from '@/lib/render'
import { Progress } from '@/components/ui/progress'

export default function RenderingPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<RenderJobStatus>({
    status: 'processing',
    progress: 0
  })

  useEffect(() => {
    if (!projectId) return

    // 1초마다 상태 폴링
    const interval = setInterval(async () => {
      try {
        const newStatus = await getRenderStatus(projectId)
        setStatus(newStatus)

        // 완료되면 완료 페이지로 이동
        if (newStatus.status === 'completed') {
          clearInterval(interval)
          navigate(`/project/${projectId}/complete`)
        }

        // 실패하면 에러 표시
        if (newStatus.status === 'failed') {
          clearInterval(interval)
          alert('렌더링 실패: ' + newStatus.error)
        }
      } catch (error) {
        console.error('Status polling failed:', error)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [projectId, navigate])

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">🎬 영상 생성 중...</h1>
        
        <Progress value={status.progress} className="w-full" />
        
        <div className="space-y-2">
          <p className="text-lg">{status.progress}%</p>
          {status.estimatedTimeRemaining && (
            <p className="text-sm text-gray-500">
              약 {status.estimatedTimeRemaining}초 남음
            </p>
          )}
        </div>

        <div className="text-left space-y-1">
          {status.progress > 0 && <p>✅ 슬라이드 생성 완료</p>}
          {status.progress > 25 && <p>✅ 음성 생성 완료</p>}
          {status.progress > 50 && <p>🔄 영상 렌더링 중...</p>}
          {status.progress > 75 && <p>⏳ 최종 처리 중...</p>}
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:underline"
        >
          대시보드로 가기
        </button>
      </div>
    </div>
  )
}
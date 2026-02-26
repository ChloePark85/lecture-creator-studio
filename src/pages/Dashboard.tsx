import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Plus, Download, Edit, Trash2, Loader2, CheckCircle2, FileEdit } from "lucide-react";
import { type ProjectStatus } from "@/types/project";
import { useProjects, useDeleteProject } from '@/hooks/useProjects';


const statusConfig: Record<ProjectStatus, { label: string; icon: React.ElementType; className: string }> = {
  draft: { label: "초안", icon: FileEdit, className: "text-muted-foreground bg-muted" },
  rendering: { label: "렌더링중", icon: Loader2, className: "text-warning bg-warning/10" },
  completed: { label: "완료", icon: CheckCircle2, className: "text-success bg-success/10" },
  failed: { label: "실패", icon: Trash2, className: "text-destructive bg-destructive/10" },
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분${s > 0 ? ` ${s}초` : ""}`;
};

const Dashboard = () => {
  const { data: projects, isLoading, isError } = useProjects();
  const deleteProject = useDeleteProject();

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteProject.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-destructive">
        프로젝트를 불러오는 데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Nav */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Video className="h-6 w-6 text-primary" />
            LectureMaker AI
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium text-foreground">대시보드</Link>
            <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground">설정</Link>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">H</div>
          </div>
        </div>
      </nav>

      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">내 프로젝트</h1>
            <p className="text-muted-foreground text-sm mt-1">강의 영상을 관리하세요</p>
          </div>
          <Link to="/project/new">
            <Button className="gap-2"><Plus className="h-4 w-4" /> 새 프로젝트</Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => {
            const status = statusConfig[project.status];
            const StatusIcon = status.icon;
            return (
              <div key={project.id} className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.title}</h3>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${status.className}`}>
                    <StatusIcon className={`h-3 w-3 ${project.status === 'rendering' ? 'animate-spin' : ''}`} />
                    {status.label}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 mb-6">
                  <p>{formatDuration(project.duration_seconds)}</p>
                  <p>{project.created_at}</p>
                </div>
                <div className="flex items-center gap-2">
                  {project.status === 'completed' && (
                    <>
                      <Link to={`/project/${project.id}/complete`}>
                        <Button variant="outline" size="sm" className="gap-1"><Download className="h-3 w-3" /> 다운로드</Button>
                      </Link>
                      <Link to={`/project/${project.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1"><Edit className="h-3 w-3" /> 편집</Button>
                      </Link>
                    </>
                  )}
                  {project.status === 'draft' && (
                    <Link to={`/project/${project.id}`}>
                      <Button size="sm" className="gap-1"><Edit className="h-3 w-3" /> 편집</Button>
                    </Link>
                  )}
                  {project.status === 'rendering' && (
                    <Link to={`/project/${project.id}/rendering`}>
                      <Button variant="outline" size="sm">진행률 확인</Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-3 w-3" /> 삭제
                  </Button>
                </div>
              </div>
            );
          })}

          {/* New project card */}
          <Link to="/project/new" className="bg-card border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[200px]">
            <Plus className="h-10 w-10 mb-3" />
            <span className="font-medium">새 프로젝트 만들기</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Download, FileText, Link2, Edit, Plus, PartyPopper } from "lucide-react";

const CompletePage = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <nav className="border-b border-border bg-background">
        <div className="container flex items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Video className="h-6 w-6 text-primary" />
            LectureMaker AI
          </Link>
        </div>
      </nav>

      <div className="container py-16 max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 text-success mb-4">
            <PartyPopper className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">영상 생성 완료!</h1>
          <p className="text-muted-foreground">강의 영상이 성공적으로 만들어졌습니다</p>
        </div>

        {/* Video player placeholder */}
        <div className="aspect-video bg-foreground/5 rounded-xl border border-border flex items-center justify-center mb-8 overflow-hidden">
          <div className="text-center text-muted-foreground">
            <Video className="h-16 w-16 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Python 기초 강의</p>
            <p className="text-xs mt-1">00:35</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold">8.5 MB</div>
              <div className="text-xs text-muted-foreground">파일 크기</div>
            </div>
            <div>
              <div className="font-semibold">35초</div>
              <div className="text-xs text-muted-foreground">길이</div>
            </div>
            <div>
              <div className="font-semibold">1920×1080</div>
              <div className="text-xs text-muted-foreground">해상도</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" /> 영상 다운로드
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <FileText className="h-4 w-4" /> 자막 다운로드
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Link2 className="h-4 w-4" /> 공유 링크 복사
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Edit className="h-4 w-4" /> 다시 편집
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost">← 대시보드로</Button>
          </Link>
          <Link to="/project/new">
            <Button variant="ghost" className="gap-2">
              <Plus className="h-4 w-4" /> 새 프로젝트
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompletePage;

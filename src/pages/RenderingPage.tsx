import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, CheckCircle2, Loader2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const steps = [
  { label: "슬라이드 생성", duration: 2000 },
  { label: "음성 생성", duration: 3000 },
  { label: "영상 렌더링", duration: 4000 },
  { label: "최종 처리", duration: 1500 },
];

const RenderingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Update step
        if (next > 20 && currentStep < 1) setCurrentStep(1);
        if (next > 50 && currentStep < 2) setCurrentStep(2);
        if (next > 85 && currentStep < 3) setCurrentStep(3);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentStep]);

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

      <div className="container py-20 max-w-lg text-center">
        <div className="text-6xl mb-6 animate-pulse-soft">🎬</div>
        <h1 className="text-2xl font-bold mb-2">
          {progress >= 100 ? "영상 생성 완료!" : "영상 생성 중..."}
        </h1>
        <p className="text-muted-foreground mb-8">
          {progress >= 100 ? "영상이 준비되었습니다" : "잠시만 기다려주세요"}
        </p>

        <Progress value={progress} className="h-3 mb-8" />

        <div className="space-y-3 text-left mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              {i < currentStep ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : i === currentStep ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={i <= currentStep ? "text-foreground" : "text-muted-foreground"}>
                {s.label}
                {i === currentStep && i < 3 && progress < 100 && "..."}
                {i < currentStep && " 완료"}
              </span>
            </div>
          ))}
        </div>

        {progress >= 100 ? (
          <Link to="/project/demo/complete">
            <Button size="lg" className="gap-2">완료 페이지로 이동</Button>
          </Link>
        ) : (
          <Link to="/dashboard">
            <Button variant="outline">대시보드로 가기</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RenderingPage;

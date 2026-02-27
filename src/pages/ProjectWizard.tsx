import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft, ArrowRight, FileText, Layout, Mic } from "lucide-react";
import StepScript from "@/components/wizard/StepScript";
import StepSlides from "@/components/wizard/StepSlides";
import StepVoice from "@/components/wizard/StepVoice";
import type { Slide, ProjectSettings, SlideTemplate, ColorTheme, VoiceType } from "@/types/project";
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { autoSplitScript } from '@/lib/slides';
import { generateTTS } from '@/lib/tts';
import { startRender } from '@/lib/render';

const STEPS = [
  { label: "스크립트 입력", icon: FileText },
  { label: "슬라이드 편집", icon: Layout },
  { label: "음성 및 생성", icon: Mic },
];

const ProjectWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [settings, setSettings] = useState<ProjectSettings>({
    template: "text",
    color_theme: "blue",
    font: "pretendard",
    voice: "female",
    voice_speed: 1,
    voice_pitch: 0,
    enable_subtitles: true,
  });

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const handleScriptSubmit = (title: string, script: string) => {
    // 빈 값 체크 및 기본값 설정
    const finalTitle = title.trim() || "제목 없음";
    const finalScript = script.trim() || "내용 없음";
    
    console.log('handleScriptSubmit', { finalTitle, finalScript, projectId });
    
    if (!projectId) {
      console.log('Creating new project...');
      createProject.mutate({ title: finalTitle, script: finalScript }, {
        onSuccess: (newProject) => {
          console.log('Project created successfully:', newProject);
          setProjectId(newProject.id);
          const newSlides = autoSplitScript(finalScript);
          console.log('Slides generated:', newSlides);
          setSlides(newSlides);
          updateProject.mutate({ id: newProject.id, updates: { slides: newSlides } });
          setStep(1);
        },
        onError: (error) => {
          console.error('Failed to create project:', error);
          alert('프로젝트 생성 실패: ' + error.message);
        }
      });
    } else {
      // If project already exists, just update script and slides
      console.log('Updating existing project...');
      const newSlides = autoSplitScript(finalScript);
      setSlides(newSlides);
      updateProject.mutate({ id: projectId, updates: { title: finalTitle, script: finalScript, slides: newSlides } });
      setStep(1);
    }
  };

  const handleNext = () => {
    console.log('handleNext clicked', { step, title, script });
    if (step === 0) {
      console.log('Submitting script...');
      handleScriptSubmit(title, script);
    } else if (step < 2) {
      console.log('Moving to next step...');
      setStep(step + 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (!projectId) {
      alert('프로젝트 ID가 없습니다. 스크립트 단계를 먼저 완료해주세요.');
      return;
    }
    try {
      // 1. 각 슬라이드에 TTS 생성
      const slidesWithAudio = await Promise.all(
        slides.map(async (slide) => {
          const { audioUrl, duration } = await generateTTS(
            slide.text,
            settings.voice
          );
          return {
            ...slide,
            audio_url: audioUrl,
            duration_seconds: duration
          };
        })
      );

      // 2. 프로젝트 업데이트
      await updateProject.mutateAsync({
        id: projectId,
        updates: {
          slides: slidesWithAudio,
          settings
        }
      });

      // 3. 렌더링 시작
      const { jobId } = await startRender(projectId);

      // 4. 렌더링 페이지로 이동
      navigate(`/project/${jobId}/rendering`);
    } catch (error) {
      console.error('Failed to start rendering:', error);
      alert('영상 생성 시작 실패');
    }
  };

  const totalDuration = slides.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);

  return (
    <div className="min-h-screen bg-secondary/30">
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 font-bold">
              <Video className="h-5 w-5 text-primary" />
              {title || "새 프로젝트"}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step + 1}/3: {STEPS[step].label}
          </div>
        </div>
      </nav>

      {/* Step indicator */}
      <div className="border-b border-border bg-background">
        <div className="container py-4">
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => i <= step ? setStep(i) : null}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                      ? "bg-accent text-accent-foreground cursor-pointer"
                      : "text-muted-foreground"
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {step === 0 && (
          <StepScript
            title={title}
            setTitle={setTitle}
            script={script}
            setScript={setScript}
          />
        )}
        {step === 1 && (
          <StepSlides
            slides={slides}
            setSlides={setSlides}
            settings={settings}
            setSettings={setSettings}
          />
        )}
        {step === 2 && (
          <StepVoice
            settings={settings}
            setSettings={setSettings}
            slidesCount={slides.length}
            totalDuration={totalDuration}
          />
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> 이전
          </Button>
          {step < 2 ? (
            <Button onClick={handleNext} className="gap-2">
              다음 단계 <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinalSubmit} className="gap-2">
              🎬 영상 생성하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectWizard;

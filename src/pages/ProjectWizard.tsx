import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft, ArrowRight, FileText, Layout, Mic } from "lucide-react";
import StepScript from "@/components/wizard/StepScript";
import StepSlides from "@/components/wizard/StepSlides";
import StepVoice from "@/components/wizard/StepVoice";
import type { Slide, ProjectSettings, SlideTemplate, ColorTheme, VoiceType } from "@/types/project";
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { autoSplitScript } from '@/lib/slides';

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
    if (!projectId) {
      createProject.mutate({ title, script }, {
        onSuccess: (newProject) => {
          setProjectId(newProject.id);
          const newSlides = autoSplitScript(script);
          setSlides(newSlides);
          updateProject.mutate({ id: newProject.id, updates: { slides: newSlides } });
          setStep(1);
        },
      });
    } else {
      // If project already exists, just update script and slides
      const newSlides = autoSplitScript(script);
      setSlides(newSlides);
      updateProject.mutate({ id: projectId, updates: { title, script, slides: newSlides } });
      setStep(1);
    }
  };

  const handleNext = () => {
    if (step === 0) {
      handleScriptSubmit(title, script);
    } else if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleGenerate = () => {
    if (projectId) {
      navigate(`/project/${projectId}/rendering`);
    } else {
      // Fallback or error handling if project ID is missing
      console.error("Project ID is missing for rendering.");
      navigate("/project/demo/rendering"); // Fallback to demo
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
            <Button onClick={handleNext} className="gap-2" disabled={step === 0 && (!script.trim() || !title.trim())}>
              다음 단계 <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleGenerate} className="gap-2">
              🎬 영상 생성하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectWizard;

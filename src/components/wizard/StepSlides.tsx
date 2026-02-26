import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Slide, ProjectSettings, SlideTemplate, ColorTheme } from "@/types/project";

interface StepSlidesProps {
  slides: Slide[];
  setSlides: (s: Slide[]) => void;
  settings: ProjectSettings;
  setSettings: (s: ProjectSettings) => void;
}

const templates: { value: SlideTemplate; label: string }[] = [
  { value: "text", label: "텍스트 중심" },
  { value: "title-image", label: "제목+이미지" },
  { value: "code", label: "코드 하이라이트" },
];

const themes: { value: ColorTheme; label: string; color: string }[] = [
  { value: "blue", label: "Blue", color: "bg-primary" },
  { value: "green", label: "Green", color: "bg-success" },
  { value: "orange", label: "Orange", color: "bg-warning" },
  { value: "purple", label: "Purple", color: "bg-[hsl(270_70%_60%)]" },
  { value: "dark", label: "Dark", color: "bg-foreground" },
];

const SlidePreview = ({ slide, settings }: { slide: Slide; settings: ProjectSettings }) => {
  const themeClasses: Record<ColorTheme, string> = {
    blue: "bg-primary/5 border-primary/20",
    green: "bg-success/5 border-success/20",
    orange: "bg-warning/5 border-warning/20",
    purple: "bg-[hsl(270_70%_95%)] border-[hsl(270_70%_80%)]",
    dark: "bg-foreground/5 border-foreground/20",
  };

  return (
    <div className={`aspect-video rounded-lg border-2 p-4 flex flex-col justify-center ${themeClasses[settings.color_theme]}`}>
      <div className="text-xs font-bold mb-2 truncate">슬라이드 {slide.order}</div>
      <p className="text-xs text-muted-foreground line-clamp-4">{slide.text}</p>
    </div>
  );
};

const StepSlides = ({ slides, setSlides, settings, setSettings }: StepSlidesProps) => {
  const selectedSlide = slides[0];
  const totalDuration = slides.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);

  const updateSlideText = (id: string, text: string) => {
    setSlides(slides.map((s) => (s.id === id ? { ...s, text, duration_seconds: Math.max(3, Math.ceil(text.length / 15)) } : s)));
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })));
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: String(Date.now()),
      order: slides.length + 1,
      text: "",
      template: settings.template,
      duration_seconds: 3,
    };
    setSlides([...slides, newSlide]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">슬라이드 편집</h2>
        <p className="text-sm text-muted-foreground">슬라이드를 편집하고 템플릿을 선택하세요</p>
      </div>

      {/* Template & Theme */}
      <div className="flex flex-wrap gap-6">
        <div>
          <label className="text-sm font-medium mb-2 block">템플릿</label>
          <div className="flex gap-2">
            {templates.map((t) => (
              <button
                key={t.value}
                onClick={() => setSettings({ ...settings, template: t.value })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  settings.template === t.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">색상 테마</label>
          <div className="flex gap-2">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setSettings({ ...settings, color_theme: t.value })}
                className={`h-8 w-8 rounded-full ${t.color} border-2 transition-all ${
                  settings.color_theme === t.value ? "border-foreground scale-110" : "border-transparent"
                }`}
                title={t.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Slides list + preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">슬라이드 ({slides.length}개)</span>
            <span className="text-xs text-muted-foreground">총 {totalDuration}초</span>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {slides.map((slide) => (
              <div key={slide.id} className="flex gap-2 items-start bg-card border border-border rounded-lg p-3">
                <GripVertical className="h-4 w-4 text-muted-foreground mt-2 shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">슬라이드 {slide.order}</span>
                    <span className="text-xs text-muted-foreground">{slide.duration_seconds}초</span>
                  </div>
                  <Textarea
                    value={slide.text}
                    onChange={(e) => updateSlideText(slide.id, e.target.value)}
                    className="text-sm min-h-[60px] resize-none"
                  />
                </div>
                <button onClick={() => removeSlide(slide.id)} className="text-muted-foreground hover:text-destructive mt-2">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={addSlide} className="w-full gap-2">
            <Plus className="h-4 w-4" /> 슬라이드 추가
          </Button>
        </div>

        <div>
          <span className="text-sm font-medium mb-3 block">미리보기</span>
          {slides.length > 0 ? (
            <div className="space-y-3">
              {slides.map((slide) => (
                <SlidePreview key={slide.id} slide={slide} settings={settings} />
              ))}
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              슬라이드가 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepSlides;

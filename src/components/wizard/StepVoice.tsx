import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play } from "lucide-react";
import type { ProjectSettings, VoiceType } from "@/types/project";

interface StepVoiceProps {
  settings: ProjectSettings;
  setSettings: (s: ProjectSettings) => void;
  slidesCount: number;
  totalDuration: number;
}

const voices: { value: VoiceType; label: string; desc: string; locked?: boolean }[] = [
  { value: "female", label: "여성 음성", desc: "자연스러운 한국어 여성 음성 (추천)" },
  { value: "male", label: "남성 음성", desc: "자연스러운 한국어 남성 음성" },
  { value: "clone", label: "목소리 클론", desc: "내 목소리로 강의 생성 (Pro)", locked: true },
];

const StepVoice = ({ settings, setSettings, slidesCount, totalDuration }: StepVoiceProps) => {
  const estMinutes = Math.ceil(totalDuration / 60);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1">음성 및 영상 생성</h2>
        <p className="text-sm text-muted-foreground">음성과 영상 설정을 확인하고 생성하세요</p>
      </div>

      {/* Voice selection */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">🎤 음성 설정</h3>
        <div className="space-y-2">
          {voices.map((v) => (
            <label
              key={v.value}
              className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                settings.voice === v.value
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary/30"
              } ${v.locked ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="voice"
                checked={settings.voice === v.value}
                onChange={() => !v.locked && setSettings({ ...settings, voice: v.value })}
                disabled={v.locked}
                className="accent-primary"
              />
              <div className="flex-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  {v.label}
                  {v.locked && <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">🔒 Pro</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{v.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Speed & Pitch */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-3 block">속도: {settings.voice_speed}x</label>
          <Slider
            value={[settings.voice_speed]}
            onValueChange={([v]) => setSettings({ ...settings, voice_speed: v })}
            min={0.8}
            max={1.5}
            step={0.1}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>느리게</span><span>빠르게</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-3 block">음높이: {settings.voice_pitch > 0 ? "+" : ""}{settings.voice_pitch}</label>
          <Slider
            value={[settings.voice_pitch]}
            onValueChange={([v]) => setSettings({ ...settings, voice_pitch: v })}
            min={-1}
            max={1}
            step={0.1}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>낮게</span><span>높게</span>
          </div>
        </div>
      </div>

      <Button variant="outline" className="gap-2">
        <Play className="h-4 w-4" /> 음성 미리듣기
      </Button>

      {/* Video settings */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">🎬 영상 설정</h3>
        <div className="bg-card border border-border rounded-lg p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">해상도</span>
            <span className="font-medium">1920×1080 (Full HD)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">자막</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_subtitles}
                onChange={(e) => setSettings({ ...settings, enable_subtitles: e.target.checked })}
                className="accent-primary"
              />
              자동 생성
            </label>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-accent rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-3">📊 최종 확인</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{slidesCount}</div>
            <div className="text-xs text-muted-foreground">슬라이드</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{totalDuration}초</div>
            <div className="text-xs text-muted-foreground">예상 길이</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">~{Math.max(1, estMinutes)}분</div>
            <div className="text-xs text-muted-foreground">생성 시간</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepVoice;

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface StepScriptProps {
  title: string;
  setTitle: (v: string) => void;
  script: string;
  setScript: (v: string) => void;
}

const StepScript = ({ title, setTitle, script, setScript }: StepScriptProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">스크립트 입력</h2>
        <p className="text-sm text-muted-foreground">강의 내용을 입력하세요. <code className="bg-muted px-1 py-0.5 rounded text-xs">---</code> 로 슬라이드를 구분할 수 있습니다.</p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">프로젝트 제목</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: Python 기초 강의"
          className="max-w-md"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">강의 스크립트</label>
          <span className="text-xs text-muted-foreground">{script.length}자</span>
        </div>
        <Textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder={`안녕하세요, 오늘은 Python 기초에 대해 알아보겠습니다.
Python은 초보자도 쉽게 배울 수 있는 프로그래밍 언어입니다.

---

Python의 첫 번째 특징은 간결한 문법입니다.
다른 언어에 비해 코드가 짧고 읽기 쉽습니다.

---

실습 예제를 보겠습니다.
print("Hello, World!")`}
          className="min-h-[300px] font-mono text-sm"
        />
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
        <Upload className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm font-medium">파일 업로드</p>
        <p className="text-xs mt-1">.txt, .md 파일을 드래그하거나 클릭하세요</p>
      </div>
    </div>
  );
};

export default StepScript;

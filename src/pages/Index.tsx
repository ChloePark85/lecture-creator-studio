import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, FileText, Mic, ArrowRight, Check, Sparkles, Clock, DollarSign } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Video className="h-6 w-6 text-primary" />
            <span>LectureMaker AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">로그인</Button>
            </Link>
            <Link to="/project/new">
              <Button size="sm">시작하기</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero-light">
        <div className="container py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm text-accent-foreground mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI 강의 영상 자동 생성
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            강의 영상,<br />
            <span className="text-primary">10분 만에 완성</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            스크립트만 입력하면 AI가 슬라이드, 나레이션, 영상을 자동으로 만들어줍니다.
            촬영도, 편집도 필요 없습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/project/new">
              <Button size="lg" className="text-base px-8 py-6 gap-2">
                무료로 시작하기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-base px-8 py-6">
              샘플 영상 보기
            </Button>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">이런 분들께 추천합니다</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: FileText, title: "온라인 강사", desc: "강의 자료는 있지만 영상 제작이 어려운 분" },
              { icon: Clock, title: "바쁜 교육자", desc: "영상 편집에 시간을 쏟기 어려운 분" },
              { icon: Sparkles, title: "콘텐츠 크리에이터", desc: "빠르게 교육 콘텐츠를 만들고 싶은 분" },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">3단계로 완성</h2>
          <p className="text-muted-foreground text-center mb-12">복잡한 과정 없이 빠르게 만드세요</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: FileText, title: "스크립트 작성", desc: "강의 내용을 텍스트로 입력하세요. AI가 자동으로 슬라이드를 분할합니다." },
              { step: "02", icon: Mic, title: "템플릿 & 음성 선택", desc: "슬라이드 디자인을 고르고 AI 음성을 설정하세요." },
              { step: "03", icon: Video, title: "영상 생성", desc: "버튼 하나로 고품질 강의 영상이 완성됩니다." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-extrabold text-primary/15 mb-4">{item.step}</div>
                <div className="h-14 w-14 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">가격</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-card">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-3xl font-extrabold mb-1">₩0</div>
              <p className="text-muted-foreground text-sm mb-6">월 5분 영상 무료</p>
              <ul className="space-y-3 mb-8">
                {["기본 템플릿 3종", "AI 음성 (남/여)", "720p 해상도", "워터마크 포함"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/project/new">
                <Button variant="outline" className="w-full">무료로 시작</Button>
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-card border-2 border-primary rounded-xl p-8 shadow-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">추천</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-3xl font-extrabold mb-1">$19.99<span className="text-base font-normal text-muted-foreground">/월</span></div>
              <p className="text-muted-foreground text-sm mb-6">무제한 영상 생성</p>
              <ul className="space-y-3 mb-8">
                {["무제한 영상 생성", "모든 템플릿 사용", "1080p Full HD", "워터마크 제거", "목소리 클론 (3개)", "자막 자동 생성"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full">Pro 시작하기</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Video className="h-5 w-5 text-primary" />
            LectureMaker AI
          </div>
          <p>© 2026 LectureMaker AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

export interface Slide {
  id: string
  order: number
  text: string
  template: 'text' | 'title-image' | 'code'
  duration?: number
}

export function autoSplitScript(script: string): Slide[] {
  // "---" 구분자로 분할
  const sections = script.split(/---+/).filter(s => s.trim())
  
  return sections.map((section, index) => ({
    id: `slide-${index + 1}`,
    order: index + 1,
    text: section.trim(),
    template: detectTemplate(section),
    duration: Math.ceil(section.length / 10)
  }))
}

function detectTemplate(text: string): 'text' | 'title-image' | 'code' {
  // 코드 블록이 있으면 code 템플릿
  if (text.includes('```') || text.includes('print(') || text.includes('function')) {
    return 'code'
  }
  
  // 짧은 텍스트는 title-image
  if (text.length < 100) {
    return 'title-image'
  }
  
  return 'text'
}

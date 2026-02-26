// TODO: OpenAI TTS API 실제 연동 필요
export async function generateTTS(text: string, voice: 'female' | 'male' = 'female') {
  // Mock implementation
  return {
    audioUrl: 'https://example.com/audio.mp3',
    duration: Math.ceil(text.length / 10) // 대략 10자 = 1초
  }
}

export async function generatePreview(text: string, voice: 'female' | 'male' = 'female') {
  // 첫 100자만 미리듣기
  const previewText = text.substring(0, 100)
  return generateTTS(previewText, voice)
}

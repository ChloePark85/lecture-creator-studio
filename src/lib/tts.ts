// OpenAI TTS 실제 구현
export async function generateTTS(
  text: string, 
  voice: 'female' | 'male' = 'female'
): Promise<{ audioUrl: string; duration: number }> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    console.warn('OpenAI API key not found, using mock')
    // Mock fallback
    return {
      audioUrl: `data:audio/mp3;base64,mock`,
      duration: Math.ceil(text.length / 10)
    }
  }

  try {
    // OpenAI TTS API 호출
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice === 'female' ? 'nova' : 'onyx', // 한국어 잘하는 목소리
        speed: 1.0
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI TTS failed: ${response.statusText}`)
    }

    // MP3 blob → base64
    const audioBlob = await response.blob()
    const audioBase64 = await blobToBase64(audioBlob)
    
    // 대략적인 duration 계산 (10자 = 1초)
    const duration = Math.ceil(text.length / 10)

    return {
      audioUrl: audioBase64,
      duration
    }
  } catch (error) {
    console.error('TTS generation failed:', error)
    // Fallback to mock
    return {
      audioUrl: `data:audio/mp3;base64,mock`,
      duration: Math.ceil(text.length / 10)
    }
  }
}

// Blob을 Base64로 변환
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function generatePreview(text: string, voice: 'female' | 'male' = 'female') {
  const previewText = text.substring(0, 100)
  return generateTTS(previewText, voice)
}

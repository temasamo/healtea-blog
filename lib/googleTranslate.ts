import { translateLimiter } from './translateLimiter';

export async function translateToEnglish(text: string): Promise<string> {
  if (!translateLimiter.canTranslate()) {
    throw new Error('翻訳制限に達しました。しばらく待ってから再試行してください。');
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('翻訳に失敗しました。');
    }

    const result = await response.json();
    translateLimiter.incrementCount();
    
    return result.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
} 
'use client';

interface TranslateButtonProps {
  title: string;
  content: string;
}

export default function TranslateButton({ title, content }: TranslateButtonProps) {
  const handleTranslate = async () => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: title + '\n\n' + content.replace(/<[^>]*>/g, '') 
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert('翻訳結果:\n\n' + result.translatedText);
      } else {
        alert('翻訳に失敗しました。');
      }
    } catch (error) {
      alert('翻訳エラーが発生しました。');
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <button 
        onClick={handleTranslate}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        🌐 英語に翻訳
      </button>
    </div>
  );
} 
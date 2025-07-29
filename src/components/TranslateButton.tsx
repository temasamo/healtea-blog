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
    <div className="mt-12 pt-8 border-t border-[#d4c4a8]/30">
      <button 
        onClick={handleTranslate}
        className="teaver-button text-white px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 font-medium text-lg"
      >
        🌐 英語に翻訳
      </button>
    </div>
  );
} 
// src/components/Chat.tsx
import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, `あなた: ${input}`]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: [
          {
            role: 'user',
            parts: [{ text: input }],
          },
        ],
      });

      setMessages((prev) => [...prev, `AI: ${response.text}`]);
    } catch (error) {
      console.error('Gemini API エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="h-[400px] overflow-y-auto border p-2 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
        {isLoading && <div>AIが考え中...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="border p-2 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問してみてください"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          送信
        </button>
      </form>
    </div>
  );
}

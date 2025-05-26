import { useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ChatList from './ChatList';
import ChatInput from './ChatInput';

const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const STORAGE_KEY = 'chat-history';

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log(saved);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const typeWriterEffect = (text: string, onDone: () => void) => {
    let i = 0;
    const speed = 30;
    const type = () => {
      setCurrentAIMessage(text.slice(0, i + 1));
      i++;
      if (i < text.length) {
        setTimeout(type, speed);
      } else {
        onDone();
      }
    };
    type();
  };

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

      const reply = response.text ?? '';
      typeWriterEffect(reply, () => {
        setMessages((prev) => [...prev, `AI: ${reply}`]);
        setCurrentAIMessage('');
      });
    } catch (error) {
      console.error('Gemini API エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <ChatList
        messages={messages}
        currentAIMessage={currentAIMessage}
        isLoading={isLoading}
      />
      <ChatInput input={input} onChange={setInput} onSubmit={handleSubmit} />
    </div>
  );
}

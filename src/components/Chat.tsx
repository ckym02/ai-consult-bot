import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import ChatList from './ChatList';
import ChatInput from './ChatInput';

const STORAGE_KEY = 'chat-history';
const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch (e) {
        console.error('履歴読み込みエラー', e);
      }
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

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
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
        const aiMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: reply,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setCurrentAIMessage('');
      });
    } catch (err) {
      console.error('Gemini API エラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content: newContent } : msg))
    );
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div className="p-4">
      <ChatList
        messages={messages}
        currentAIMessage={currentAIMessage}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ChatInput input={input} onChange={setInput} onSubmit={handleSubmit} />
    </div>
  );
}

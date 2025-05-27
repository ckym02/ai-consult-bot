import { useState } from 'react';
import type { Message } from './Chat';

interface ChatMessageProps {
  message: Message;
  onEdit: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
}

export default function ChatMessage({ message, onEdit, onDelete }: ChatMessageProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(message.content);

  const handleSave = () => {
    onEdit(message.id, text);
    setEditing(false);
  };

  return (
    <div className="mb-2 border p-2 rounded">
      <strong>{message.role === 'user' ? 'あなた' : 'AI'}:</strong>
      {editing ? (
        <div className="flex gap-2 mt-1">
          <input
            className="border p-1 flex-grow"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleSave}>保存</button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-1">
          <span>{message.content}</span>
          <div className="text-sm space-x-2">
            <button onClick={() => setEditing(true)}>編集</button>
            <button onClick={() => onDelete(message.id)}>削除</button>
          </div>
        </div>
      )}
    </div>
  );
}

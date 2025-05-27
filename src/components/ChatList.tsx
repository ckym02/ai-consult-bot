import ChatMessage from './ChatMessage';
import type { Message } from './Chat';

interface ChatListProps {
  messages: Message[];
  currentAIMessage: string;
  isLoading: boolean;
  onEdit: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
}

export default function ChatList({
  messages,
  currentAIMessage,
  isLoading,
  onEdit,
  onDelete,
}: ChatListProps) {
  return (
    <div className="h-[400px] overflow-y-auto border p-2 mb-4">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {currentAIMessage && (
        <div className="mb-2">
          <strong>AI:</strong> {currentAIMessage}
        </div>
      )}
      {isLoading && !currentAIMessage && <div>AIが考え中...</div>}
    </div>
  );
}

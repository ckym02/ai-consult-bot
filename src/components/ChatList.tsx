import ChatMessage from './ChatMessage';

interface ChatListProps {
  messages: string[];
  currentAIMessage: string;
  isLoading: boolean;
}

export default function ChatList({
  messages,
  currentAIMessage,
  isLoading,
}: ChatListProps) {
  return (
    <div className="h-[400px] overflow-y-auto border p-2 mb-4">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {currentAIMessage && <ChatMessage message={`AI: ${currentAIMessage}`} />}
      {isLoading && !currentAIMessage && <div>AIが考え中...</div>}
    </div>
  );
}

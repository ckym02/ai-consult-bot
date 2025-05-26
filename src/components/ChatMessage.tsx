interface ChatMessageProps {
  message: string;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return <div className="mb-2">{message}</div>;
}

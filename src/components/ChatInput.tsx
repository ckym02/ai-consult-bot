interface ChatInputProps {
  input: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({ input, onChange, onSubmit }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="border p-2 flex-grow"
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="質問してみてください"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
        送信
      </button>
    </form>
  );
}

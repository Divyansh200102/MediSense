import { Loader2, Sparkles } from 'lucide-react';

export default function Spinner({ text = 'AI is thinking...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
        </div>
        <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1 animate-pulse-soft" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">{text}</p>
        <div className="flex items-center gap-1 justify-center mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/assessment';
import { getAIProvider } from '../../lib/ai';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatPaneProps {
  messages: ChatMessage[];
  onNewMessage: (message: ChatMessage) => void;
  onInsertText: (text: string, messageId: string) => void;
  readOnly?: boolean;
  courseCode?: string;
  variant?: 'default' | 'book' | 'folio';
}

export function ChatPane({
  messages,
  onNewMessage,
  onInsertText,
  readOnly = false,
  courseCode,
  variant = 'default',
}: ChatPaneProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || readOnly) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role: 'student',
      content: input.trim(),
      createdAt: Date.now(),
    };

    onNewMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const provider = getAIProvider();
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const aiResponse = await provider.generateResponse(userMessage.content, chatHistory);

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'ai',
        content: aiResponse,
        createdAt: Date.now(),
      };

      onNewMessage(aiMessage);
    } catch (error) {
      console.error('AI error:', error);
      const friendly =
        error instanceof Error && error.message
          ? error.message
          : 'Sorry, the AI assistant is temporarily unavailable. Please try again.';
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'ai',
        content: friendly,
        createdAt: Date.now(),
      };
      onNewMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInsert = (message: ChatMessage) => {
    if (readOnly) return;
    const insertFunction = (window as any).__editorInsertText;
    if (insertFunction) {
      insertFunction(message.content, message.id);
      onInsertText(message.content, message.id);
    }
  };

  const isMargin = variant === 'book' || variant === 'folio';

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        isMargin ? 'bg-transparent' : 'bg-white text-ink border-l border-[#E8E6E1] w-[320px]',
      )}
    >
      <div className={cn('shrink-0', isMargin ? 'px-1 pt-1 pb-2' : 'border-b border-[#E8E6E1] p-4')}>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#999]">
          <Sparkles className="h-3.5 w-3.5" />
          MARGIN NOTES
          {courseCode ? <span className="font-normal tracking-normal">· {courseCode}</span> : null}
        </div>
      </div>

      <div className={cn('flex-1 overflow-y-auto space-y-3', isMargin ? 'px-1 pb-2' : 'p-4')}>
        {messages.length === 0 && (
          <div className="text-ink-subtle text-center py-8 text-sm px-2">
            Ask the AI tutor — replies appear as sticky margin notes.
          </div>
        )}

        {messages.map((message, idx) => {
          const isStudent = message.role === 'student';
          const tilt = ((idx % 3) - 1) * 0.6;
          return (
            <div
              key={message.id}
              className={cn(
                'rounded p-3.5 text-[13px] leading-relaxed text-[#333] shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
                isStudent
                  ? 'bg-[#F0F7FF] border border-[#B8D4F0]'
                  : 'bg-[#FFF9E6] border border-[#F0E0A0]',
              )}
              style={{ transform: `rotate(${tilt}deg)` }}
            >
              <div
                className={cn(
                  'text-[11px] font-bold mb-1.5',
                  isStudent ? 'text-[#3D6B9A]' : 'text-[#A08020]',
                )}
              >
                {isStudent ? 'You asked' : 'AI · draft ready'}
              </div>
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              {!isStudent && !readOnly && (
                <button
                  onClick={() => handleInsert(message)}
                  className="mt-2.5 inline-flex text-[11px] font-semibold px-2 py-1 rounded bg-white border border-[#F0E0A0] text-ink hover:bg-[#FFF9E6]"
                >
                  Insert ¶
                </button>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="bg-[#FFF9E6] border border-[#F0E0A0] rounded p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-[11px] font-bold text-[#A08020] mb-1.5">AI · thinking</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-ink-subtle rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-ink-subtle rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-ink-subtle rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!readOnly && (
        <div
          className={cn(
            'shrink-0 flex gap-2 bg-white border border-[#E8E6E1] rounded-[10px] p-2.5',
            isMargin ? 'mt-auto' : 'border-t rounded-none m-0',
          )}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AI…"
            aria-label="Ask AI"
            className="flex-1 border-none outline-none text-[13px] bg-transparent text-ink placeholder:text-ink-subtle"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-3 py-1.5 text-[12px] font-semibold rounded-lg bg-ink text-white hover:bg-[#222] disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

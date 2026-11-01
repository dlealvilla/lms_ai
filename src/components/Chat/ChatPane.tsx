import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/assessment';
import { getAIProvider } from '../../lib/ai';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import { Skeleton } from '@/components/ui/Skeleton';

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
        isError: true,
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
    } else {
      showToast('Editor is not ready for insert', 'error');
    }
  };

  const isMargin = variant === 'book' || variant === 'folio';

  return (
    <div
      className={cn(
        'flex flex-col h-full min-h-0',
        isMargin ? 'bg-transparent' : 'bg-white text-ink border-l border-[#E8E6E1] w-[320px]',
      )}
    >
      <div className={cn('shrink-0', isMargin ? 'px-1 pt-0.5 pb-2' : 'border-b border-[#E8E6E1] p-4')}>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#999]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          MARGIN NOTES
          {courseCode ? <span className="font-normal tracking-normal">· {courseCode}</span> : null}
        </div>
      </div>

      <div className={cn('flex-1 overflow-y-auto space-y-3 min-h-0', isMargin ? 'px-1 pb-2' : 'p-4')}>
        {messages.length === 0 && !isLoading && (
          <div className="rounded-xl border border-dashed border-[#E8E6E1] bg-[#FAFAF8] px-4 py-8 text-center">
            <div className="text-sm font-semibold text-ink mb-1">Ask in the margin</div>
            <p className="text-[13px] text-ink-muted leading-relaxed">
              Replies land as sticky notes beside your draft. Use Insert to pull a suggestion into the essay.
            </p>
          </div>
        )}

        {messages.map((message, idx) => {
          const isStudent = message.role === 'student';
          const tilt = ((idx % 3) - 1) * 0.55;
          return (
            <div
              key={message.id}
              className={cn(
                'rounded-lg p-3.5 text-[13px] leading-relaxed text-[#333] shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
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
                {isStudent ? 'You asked' : message.isError ? 'AI · notice' : 'AI · draft ready'}
              </div>
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              {!isStudent && !readOnly && !message.isError && (
                <button
                  type="button"
                  onClick={() => handleInsert(message)}
                  className="mt-2.5 inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white border border-[#F0E0A0] text-ink hover:bg-[#FFF9E6] focus-visible:ring-2 focus-visible:ring-ink"
                >
                  Insert ¶
                </button>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="bg-[#FFF9E6] border border-[#F0E0A0] rounded-lg p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-[11px] font-bold text-[#A08020] mb-2.5">AI · thinking</div>
            <div className="space-y-2" role="status" aria-label="AI is thinking">
              <Skeleton className="h-3 w-full bg-[#F0E0A0]/50" />
              <Skeleton className="h-3 w-5/6 bg-[#F0E0A0]/40" />
              <Skeleton className="h-3 w-2/3 bg-[#F0E0A0]/30" />
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
            className="flex-1 border-none outline-none text-[13px] bg-transparent text-ink placeholder:text-ink-subtle focus-visible:outline-none"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="folio-btn-primary !px-3 !py-1.5 !text-[12px]"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

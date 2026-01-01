import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/assessment';
import { getAIProvider } from '../../lib/ai';

interface ChatPaneProps {
  messages: ChatMessage[];
  onNewMessage: (message: ChatMessage) => void;
  onInsertText: (text: string, messageId: string) => void;
  readOnly?: boolean;
}

export function ChatPane({ messages, onNewMessage, onInsertText, readOnly = false }: ChatPaneProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
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

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-300" style={{ width: '400px' }}>
      <div className="border-b border-gray-300 p-4 bg-gray-50">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            Start a conversation with the AI assistant to get help with your assessment.
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'student' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'student'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              {message.role === 'ai' && !readOnly && (
                <button
                  onClick={() => handleInsert(message)}
                  className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Insert into document
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {!readOnly && (
        <div className="border-t border-gray-300 p-4 bg-gray-50">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask the AI assistant..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


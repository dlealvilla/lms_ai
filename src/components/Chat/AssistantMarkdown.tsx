import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { normalizeAssistantText } from '@/lib/ai/assistantText';

const ALLOWED_URL = /^(https?:|mailto:)/i;

function safeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!ALLOWED_URL.test(trimmed)) return undefined;
  return trimmed;
}

const components: Components = {
  a({ href, children }) {
    const safe = safeUrl(href);
    if (!safe) return <span>{children}</span>;
    return (
      <a href={safe} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

interface AssistantMarkdownProps {
  text: string;
  className?: string;
}

/** Render an assistant reply as markdown. Raw HTML is not passed through. */
export function AssistantMarkdown({ text, className }: AssistantMarkdownProps) {
  const source = normalizeAssistantText(text);
  if (!source) return null;
  return (
    <div className={className ? `assistant-md ${className}` : 'assistant-md'}>
      <ReactMarkdown skipHtml urlTransform={(url) => safeUrl(url) ?? ''} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}

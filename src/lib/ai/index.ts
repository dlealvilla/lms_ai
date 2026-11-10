import type { AIProvider } from './types';
import { getAuthHeaders } from '../auth/AuthContext';

/** Pull a usable assistant string from common API / stub shapes. */
function extractAssistantText(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  for (const key of ['response', 'reply', 'message', 'text', 'content']) {
    const v = d[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  // Nested: { data: { response } } / { result: { text } }
  for (const nest of ['data', 'result', 'output']) {
    const inner = d[nest];
    if (inner && typeof inner === 'object') {
      const found = extractAssistantText(inner);
      if (found) return found;
    }
  }
  return null;
}

class APIAIProvider implements AIProvider {
  async generateResponse(prompt: string, chatHistory: Array<{ role: string; content: string }>): Promise<string> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        prompt,
        chatHistory,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (typeof (data as any)?.error === 'string' && (data as any).error) ||
        (typeof (data as any)?.message === 'string' && (data as any).message) ||
        'The AI assistant is temporarily unavailable. Please try again in a moment.';
      throw new Error(message);
    }

    const text = extractAssistantText(data);
    if (!text) {
      throw new Error('The AI assistant returned an empty response. Please try again.');
    }

    return text;
  }
}

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!providerInstance) {
    providerInstance = new APIAIProvider();
  }
  return providerInstance;
}

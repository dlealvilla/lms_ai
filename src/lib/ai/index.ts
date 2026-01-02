import { MockAIProvider } from './mock';
import type { AIProvider } from './types';

class APIAIProvider implements AIProvider {
  async generateResponse(prompt: string, chatHistory: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          chatHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.mockResponse) {
          return errorData.mockResponse;
        }
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('API error:', error);
      const mockProvider = new MockAIProvider();
      return mockProvider.generateResponse(prompt, chatHistory);
    }
  }
}

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (providerInstance) {
    return providerInstance;
  }
  providerInstance = new APIAIProvider();
  return providerInstance;
}

export function isMockMode(): boolean {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return !apiKey || (typeof apiKey === 'string' && apiKey.trim() === '');
}


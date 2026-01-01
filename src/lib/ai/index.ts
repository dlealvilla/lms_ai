import { GeminiAIProvider } from './gemini';
import { MockAIProvider } from './mock';
import type { AIProvider } from './types';

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (apiKey && apiKey.trim() !== '') {
    providerInstance = new GeminiAIProvider(apiKey);
  } else {
    providerInstance = new MockAIProvider();
  }

  return providerInstance;
}

export function isMockMode(): boolean {
  return providerInstance instanceof MockAIProvider;
}


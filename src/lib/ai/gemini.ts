import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProvider } from './types';

export class GeminiAIProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(prompt: string, chatHistory: Array<{ role: string; content: string }>): Promise<string> {
    try {
      // Convert chat history to Gemini format
      const history = chatHistory.slice(-10).map(msg => ({
        role: msg.role === 'student' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = this.model.startChat({
        history: history.length > 0 ? history : undefined,
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }
}


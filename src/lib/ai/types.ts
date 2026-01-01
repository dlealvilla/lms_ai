export interface AIProvider {
  generateResponse(prompt: string, chatHistory: Array<{ role: string; content: string }>): Promise<string>;
}


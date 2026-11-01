import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, chatHistory } = request.body;

    if (!prompt || typeof prompt !== 'string') {
      return response.status(400).json({ error: 'Prompt is required' });
    }

    // Server-only key — never use a VITE_ prefix (that would bundle into the client)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      console.error('GEMINI_API_KEY is not configured');
      return response.status(503).json({
        error:
          'The AI assistant is not configured yet. Please ask your administrator to set GEMINI_API_KEY.',
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-2.5-flash (available and supports generateContent)
    // Model names must include the 'models/' prefix
    // Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-pro-latest, etc.
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('Using gemini-2.5-flash model');

    // Convert chat history to Gemini format
    // Filter and ensure first message is from user
    let history = (chatHistory || [])
      .slice(-10)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'student' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    // Gemini requires first message to be from 'user', not 'model'
    // Remove any leading 'model' messages
    while (history.length > 0 && history[0].role === 'model') {
      history = history.slice(1);
    }

    // If no valid history (all were model messages), use empty history
    if (history.length === 0 || history[0].role !== 'user') {
      history = [];
    }

    // Start chat with history (or without if empty)
    const chat = model.startChat({
      history: history.length > 0 ? history : undefined,
    });

    // Send message
    const result = await chat.sendMessage(prompt);
    const aiResponse = await result.response;
    const text = aiResponse.text();

    return response.status(200).json({ response: text });
  } catch (error: any) {
    console.error('Gemini API error:', error?.message || error);
    
    const raw = String(error?.message || '');
    const isKeyIssue =
      /api key|API_KEY|invalid|PERMISSION_DENIED|401|403/i.test(raw);

    return response.status(isKeyIssue ? 503 : 500).json({
      error: isKeyIssue
        ? 'The AI assistant could not authenticate. Please ask your administrator to check GEMINI_API_KEY.'
        : 'The AI assistant is temporarily unavailable. Please try again in a moment.',
    });
  }
}


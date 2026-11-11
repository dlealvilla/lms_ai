import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSessionFromRequest } from './lib/auth.js';
import { consumeAll, getClientIp, type RateLimitRule } from './lib/rate-limit.js';

// Generous limits: a student chatting normally sends a few messages a minute.
// These only exist to stop scripted abuse of the Gemini quota.
export const CHAT_RATE_LIMITS: Record<'userBurst' | 'userHour' | 'ipBurst', RateLimitRule> = {
  userBurst: { name: 'chat:user:5m', limit: 40, windowMs: 5 * 60 * 1000 },
  userHour: { name: 'chat:user:1h', limit: 300, windowMs: 60 * 60 * 1000 },
  // Per IP is higher so a classroom behind one NAT is not affected.
  ipBurst: { name: 'chat:ip:5m', limit: 400, windowMs: 5 * 60 * 1000 },
};

const MAX_PROMPT_CHARS = 20_000;
const MAX_HISTORY_MESSAGE_CHARS = 20_000;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Require a valid signed session (any role) before spending AI quota.
  const session = getSessionFromRequest(request);
  if (!session) {
    return response.status(401).json({ error: 'Unauthorized', message: 'Please sign in again.' });
  }

  const limit = consumeAll([
    { rule: CHAT_RATE_LIMITS.userBurst, key: `${session.tenantId}:${session.userId}` },
    { rule: CHAT_RATE_LIMITS.userHour, key: `${session.tenantId}:${session.userId}` },
    { rule: CHAT_RATE_LIMITS.ipBurst, key: getClientIp(request) },
  ]);
  if (!limit.allowed) {
    response.setHeader('Retry-After', String(limit.retryAfterSec));
    return response.status(429).json({
      error: 'You are sending messages very quickly. Please wait a moment and try again.',
    });
  }

  try {
    const { prompt, chatHistory } = request.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return response.status(400).json({ error: 'Prompt is required' });
    }
    if (prompt.length > MAX_PROMPT_CHARS) {
      return response.status(413).json({ error: 'That message is too long. Please shorten it and try again.' });
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

    // Default Flash model. gemini-2.5-flash returns 404 for new Gemini keys.
    // Google suggests gemini-3.8-flash, but that model (and 3.7) timed out on a
    // free-tier key; gemini-3.6-flash responds. Override with GEMINI_MODEL.
    const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';
    const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
    const model = genAI.getGenerativeModel({ model: modelName });
    console.log(`Using ${modelName} model`);

    // Convert chat history to Gemini format
    // Filter and ensure first message is from user
    let history = (Array.isArray(chatHistory) ? chatHistory : [])
      .slice(-10)
      .filter(
        (msg: unknown): msg is { role: string; content: string } =>
          !!msg &&
          typeof (msg as Record<string, unknown>).content === 'string' &&
          typeof (msg as Record<string, unknown>).role === 'string',
      )
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'student' ? 'user' : 'model',
        parts: [{ text: msg.content.slice(0, MAX_HISTORY_MESSAGE_CHARS) }],
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


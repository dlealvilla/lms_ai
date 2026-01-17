import type { VercelRequest } from '@vercel/node';

// Mock JWT-like token structure
// In production, use proper JWT library with signing

export interface TokenPayload {
  userId: string;
  tenantId: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
  email: string;
  name: string;
  exp: number;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-key-change-in-production';

// Simple base64 encoding for mock token (NOT secure for production)
export function createMockToken(payload: Omit<TokenPayload, 'exp'>): string {
  const tokenPayload: TokenPayload = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const jsonString = JSON.stringify(tokenPayload);
  return Buffer.from(jsonString).toString('base64');
}

export function verifyMockToken(token: string): TokenPayload | null {
  try {
    const jsonString = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonString) as TokenPayload;
    
    // Check expiration
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: VercelRequest): string | null {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

export function getSessionFromRequest(request: VercelRequest): TokenPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyMockToken(token);
}

// Role validation
export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';

export function requireRole(session: TokenPayload | null, allowedRoles: Role[]): TokenPayload {
  if (!session) {
    throw new AuthError('Unauthorized', 401);
  }
  
  if (!allowedRoles.includes(session.role)) {
    throw new AuthError('Forbidden', 403);
  }
  
  return session;
}

export class AuthError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}


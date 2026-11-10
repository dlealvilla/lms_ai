import type { VercelRequest } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Session tokens for the demo ("mock") login.
 *
 * Format: `v1.<base64url(JSON payload)>.<base64url(HMAC-SHA256)>`
 * The HMAC is computed over `v1.<payload>` with TOKEN_SECRET, so a token
 * cannot be forged or edited (e.g. to change role, userId or tenantId)
 * without the server secret. Old unsigned base64 tokens are rejected.
 */

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
const ROLES: readonly Role[] = ['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'];

export interface TokenPayload {
  userId: string;
  tenantId: string;
  role: Role;
  email: string;
  name: string;
  /** Issued-at, ms since epoch */
  iat?: number;
  /** Expiry, ms since epoch */
  exp: number;
}

const TOKEN_VERSION = 'v1';
export const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (unchanged)
/** Small allowance for clock skew between instances. */
const CLOCK_SKEW_MS = 5 * 60 * 1000;
/** Hard cap on token size so a giant header cannot waste CPU. */
const MAX_TOKEN_LENGTH = 4096;

const DEV_FALLBACK_SECRET = 'dev-secret-key-change-in-production';

function isDeployed(): boolean {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview'
  );
}

/**
 * Resolve the signing secret at call time. Deployed environments fail closed
 * if TOKEN_SECRET is missing; local dev falls back to a fixed dev secret.
 */
export function resolveTokenSecret(): string {
  const fromEnv = process.env.TOKEN_SECRET;
  if (fromEnv && fromEnv.trim() !== '') {
    return fromEnv;
  }
  if (isDeployed()) {
    throw new Error(
      'TOKEN_SECRET must be set in production. Refusing to sign or verify tokens with a weak default.',
    );
  }
  return DEV_FALLBACK_SECRET;
}

function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

function isNonEmptyString(v: unknown, max = 512): v is string {
  return typeof v === 'string' && v.length > 0 && v.length <= max;
}

function isValidPayload(p: unknown): p is TokenPayload {
  if (!p || typeof p !== 'object') return false;
  const o = p as Record<string, unknown>;
  return (
    isNonEmptyString(o.userId, 128) &&
    isNonEmptyString(o.tenantId, 128) &&
    typeof o.role === 'string' &&
    (ROLES as readonly string[]).includes(o.role) &&
    typeof o.email === 'string' &&
    o.email.length <= 320 &&
    typeof o.name === 'string' &&
    o.name.length <= 512 &&
    typeof o.exp === 'number' &&
    Number.isFinite(o.exp) &&
    (o.iat === undefined || (typeof o.iat === 'number' && Number.isFinite(o.iat)))
  );
}

export function createSessionToken(
  payload: Omit<TokenPayload, 'exp' | 'iat'>,
  now: number = Date.now(),
): string {
  const tokenPayload: TokenPayload = {
    userId: payload.userId,
    tenantId: payload.tenantId,
    role: payload.role,
    email: payload.email,
    name: payload.name,
    iat: now,
    exp: now + TOKEN_TTL_MS,
  };
  const body = base64UrlEncode(JSON.stringify(tokenPayload));
  const signingInput = `${TOKEN_VERSION}.${body}`;
  return `${signingInput}.${sign(signingInput, resolveTokenSecret())}`;
}

/**
 * Verify a session token. Returns null for anything that is not a valid,
 * correctly signed, unexpired v1 token (including legacy unsigned tokens).
 */
export function verifySessionToken(token: string, now: number = Date.now()): TokenPayload | null {
  try {
    if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
      return null;
    }
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [version, body, signature] = parts;
    if (version !== TOKEN_VERSION || !body || !signature) return null;

    const expected = Buffer.from(sign(`${version}.${body}`, resolveTokenSecret()), 'base64url');
    const provided = Buffer.from(signature, 'base64url');
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      return null;
    }

    const payload: unknown = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (!isValidPayload(payload)) return null;

    if (payload.exp <= now) return null; // expired
    if (payload.exp > now + TOKEN_TTL_MS + CLOCK_SKEW_MS) return null; // implausible expiry
    if (payload.iat !== undefined && payload.iat > now + CLOCK_SKEW_MS) return null; // issued in the future

    return payload;
  } catch {
    return null;
  }
}

/** @deprecated kept for existing call sites; tokens are now signed. */
export const createMockToken = createSessionToken;
/** @deprecated kept for existing call sites; tokens are now verified. */
export const verifyMockToken = (token: string) => verifySessionToken(token);

export function getTokenFromRequest(request: VercelRequest): string | null {
  const authHeader = request.headers?.authorization;
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  return token || null;
}

export function getSessionFromRequest(request: VercelRequest): TokenPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

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

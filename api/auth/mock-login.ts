import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withDbRetry } from '../lib/db.js';
import { createSessionToken } from '../lib/auth.js';
import { consume, getClientIp, type RateLimitRule } from '../lib/rate-limit.js';

const ROLE_ENUM = ['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'] as const;
type RoleEnum = (typeof ROLE_ENUM)[number];

/**
 * Roles reachable through the demo login screens (/login/student,
 * /login/teacher, /login/admin). SUPER_ADMIN is not offered by any screen,
 * so the mock login no longer issues it or switches an account to it.
 */
const MOCK_LOGIN_ROLES: readonly RoleEnum[] = ROLE_ENUM.filter((r) => r !== 'SUPER_ADMIN');

/** The only tenant the demo client ever logs into. */
const DEFAULT_TENANT_SLUG = 'wildmind-academy';
const MOCK_LOGIN_TENANTS: readonly string[] = [DEFAULT_TENANT_SLUG];

const MAX_EMAIL_LENGTH = 254;
// Same shape a browser <input type="email"> accepts: something@something, no spaces.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+$/;

// Generous abuse guards (per serverless instance). Normal demo use never gets close.
export const MOCK_LOGIN_RATE_LIMITS: Record<'ipLogin' | 'ipCreate', RateLimitRule> = {
  ipLogin: { name: 'mock-login:ip:10m', limit: 200, windowMs: 10 * 60 * 1000 },
  ipCreate: { name: 'mock-login:create:ip:1h', limit: 100, windowMs: 60 * 60 * 1000 },
};

/**
 * Map any client-provided role string to the Prisma Role enum.
 * Production bug: demo clients sometimes send "teacher"/"student"/"admin"
 * (lowercase) which Prisma rejects with "Invalid value for argument role".
 */
function normalizeRole(raw: unknown): RoleEnum | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const upper = raw.trim().toUpperCase().replace(/[\s-]+/g, '_');
  // Accept common aliases
  const aliases: Record<string, RoleEnum> = {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
    SUPERADMIN: 'SUPER_ADMIN',
  };
  return aliases[upper] ?? null;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = getClientIp(request);
  const loginLimit = consume(MOCK_LOGIN_RATE_LIMITS.ipLogin, clientIp);
  if (!loginLimit.allowed) {
    response.setHeader('Retry-After', String(loginLimit.retryAfterSec));
    return response.status(429).json({
      error: 'Too many sign-in attempts',
      message: 'Too many sign-in attempts. Please wait a few minutes and try again.',
    });
  }

  try {
    const { email, role: rawRole, tenantSlug } = request.body || {};

    if (!email || rawRole == null || rawRole === '') {
      return response.status(400).json({ error: 'Email and role are required' });
    }

    if (
      typeof email !== 'string' ||
      email.length > MAX_EMAIL_LENGTH ||
      !EMAIL_SHAPE.test(email)
    ) {
      return response.status(400).json({
        error: 'Invalid email',
        message: 'Please enter a valid email address.',
      });
    }

    const role = normalizeRole(rawRole);
    if (!role || !MOCK_LOGIN_ROLES.includes(role)) {
      return response.status(400).json({
        error: 'Invalid role',
        message: `Role must be one of: ${MOCK_LOGIN_ROLES.join(', ')} (case-insensitive)`,
      });
    }

    const slug = tenantSlug == null || tenantSlug === '' ? DEFAULT_TENANT_SLUG : tenantSlug;
    if (typeof slug !== 'string' || !MOCK_LOGIN_TENANTS.includes(slug)) {
      return response.status(404).json({ error: 'Tenant not found' });
    }

    // Find tenant (retry: Neon free tier can be cold on first request)
    const tenant = await withDbRetry(
      () =>
        prisma.tenant.findUnique({
          where: { slug },
        }),
      { label: 'mock-login:tenant' },
    );

    if (!tenant) {
      return response.status(404).json({ error: 'Tenant not found' });
    }

    // Find or create user with mock login
    let user = await withDbRetry(
      () =>
        prisma.user.findUnique({
          where: {
            tenantId_email: {
              tenantId: tenant.id,
              email: email,
            },
          },
        }),
      { label: 'mock-login:user' },
    );

    // For mock login, create user if not exists
    if (!user) {
      const createLimit = consume(MOCK_LOGIN_RATE_LIMITS.ipCreate, clientIp);
      if (!createLimit.allowed) {
        response.setHeader('Retry-After', String(createLimit.retryAfterSec));
        return response.status(429).json({
          error: 'Too many new accounts',
          message: 'Too many new demo accounts from this network. Please try again later.',
        });
      }

      // Generate a name from email
      const namePart = email.split('@')[0];
      const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      user = await withDbRetry(
        () =>
          prisma.user.create({
            data: {
              tenantId: tenant.id,
              email: email,
              name: name,
              role: role,
              status: 'ACTIVE',
            },
          }),
        { label: 'mock-login:create-user' },
      );
    }

    // Verify role matches (for mock login, we allow the requested role)
    // In production, you'd verify against the actual user role
    // Owner decision pending: this still lets any visitor switch an existing
    // account's role via the demo screens (see PR "Needs owner decision").
    // Users already at SUPER_ADMIN are never downgraded or touched here.
    if (user.role !== role && user.role !== 'SUPER_ADMIN') {
      // Update role for mock login flexibility
      user = await withDbRetry(
        () =>
          prisma.user.update({
            where: { id: user!.id },
            data: { role: role },
          }),
        { label: 'mock-login:update-role' },
      );
    }

    // Create token
    const token = createSessionToken({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role as RoleEnum,
      email: user.email,
      name: user.name,
    });

    return response.status(200).json({
      token,
      user: {
        id: user.id,
        tenantId: tenant.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Mock login error:', error);
    const message = String(error?.message || 'Login failed');
    const cold =
      /Can't reach database server|P1001|P1002|timed out|connection/i.test(message);
    return response.status(cold ? 503 : 500).json({
      error: cold
        ? 'Database is waking up. Please wait a few seconds and try again.'
        : 'Login failed',
      message,
    });
  }
}

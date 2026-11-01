import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withDbRetry } from '../lib/db.js';
import { createMockToken } from '../lib/auth.js';

const ROLE_ENUM = ['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'] as const;
type RoleEnum = (typeof ROLE_ENUM)[number];

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

  try {
    const { email, role: rawRole, tenantSlug } = request.body;

    if (!email || rawRole == null || rawRole === '') {
      return response.status(400).json({ error: 'Email and role are required' });
    }

    const role = normalizeRole(rawRole);
    if (!role) {
      return response.status(400).json({
        error: 'Invalid role',
        message: `Role must be one of: ${ROLE_ENUM.join(', ')} (case-insensitive)`,
      });
    }

    // Find tenant (retry: Neon free tier can be cold on first request)
    const tenant = await withDbRetry(
      () =>
        prisma.tenant.findUnique({
          where: { slug: tenantSlug || 'wildmind-academy' },
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
    if (user.role !== role) {
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
    const token = createMockToken({
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

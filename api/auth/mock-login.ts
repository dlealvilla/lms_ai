import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/db.js';
import { createMockToken } from '../lib/auth.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, role, tenantSlug } = request.body;

    if (!email || !role) {
      return response.status(400).json({ error: 'Email and role are required' });
    }

    // Find tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug || 'wildmind-academy' },
    });

    if (!tenant) {
      return response.status(404).json({ error: 'Tenant not found' });
    }

    // Find or create user with mock login
    let user = await prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: email,
        },
      },
    });

    // For mock login, create user if not exists
    if (!user) {
      // Generate a name from email
      const namePart = email.split('@')[0];
      const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      user = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: email,
          name: name,
          role: role,
          status: 'ACTIVE',
        },
      });
    }

    // Verify role matches (for mock login, we allow the requested role)
    // In production, you'd verify against the actual user role
    if (user.role !== role) {
      // Update role for mock login flexibility
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: role },
      });
    }

    // Create token
    const token = createMockToken({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role as 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN',
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
    return response.status(500).json({ error: 'Login failed', message: error.message });
  }
}


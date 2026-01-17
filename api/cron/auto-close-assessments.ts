import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/db.js';

// Cron endpoint to auto-close assessments
// Protected by CRON_SECRET header
// Schedule: run every 5-10 minutes via Vercel Cron

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow GET for cron jobs
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = request.headers['x-cron-secret'];

  if (cronSecret && providedSecret !== cronSecret) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = new Date();

    // Find assessments that should be auto-closed
    const assessmentsToClose = await prisma.assessment.findMany({
      where: {
        status: 'OPEN',
        closeAtDue: true,
        dueAt: {
          lte: now,
        },
      },
    });

    if (assessmentsToClose.length === 0) {
      return response.status(200).json({
        message: 'No assessments to close',
        closed: 0,
      });
    }

    // Close each assessment and log history
    const closedIds: string[] = [];

    for (const assessment of assessmentsToClose) {
      await prisma.$transaction([
        // Update assessment status
        prisma.assessment.update({
          where: { id: assessment.id },
          data: {
            status: 'CLOSED',
            updatedAt: now,
          },
        }),
        // Create history record
        prisma.assessmentStatusHistory.create({
          data: {
            tenantId: assessment.tenantId,
            assessmentId: assessment.id,
            changedByUserId: 'system', // System user placeholder
            fromStatus: 'OPEN',
            toStatus: 'CLOSED',
            reason: 'Auto-closed at due date by cron job',
          },
        }),
      ]);

      closedIds.push(assessment.id);
    }

    console.log(`Auto-closed ${closedIds.length} assessments:`, closedIds);

    return response.status(200).json({
      message: `Auto-closed ${closedIds.length} assessments`,
      closed: closedIds.length,
      assessmentIds: closedIds,
    });
  } catch (error: any) {
    console.error('Auto-close cron error:', error);
    return response.status(500).json({ error: 'Cron job failed', message: error.message });
  }
}


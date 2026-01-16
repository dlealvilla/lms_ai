import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, del } from '@vercel/blob';
import { prisma } from '../../../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../../../lib/auth.js';

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getSessionFromRequest(request);
    const user = requireRole(session, ['TEACHER']);
    
    const { assessmentId } = request.query;
    if (!assessmentId || typeof assessmentId !== 'string') {
      return response.status(400).json({ error: 'Assessment ID required' });
    }

    // Get assessment and verify teacher is assigned to the course
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: assessmentId,
        tenantId: user.tenantId,
      },
      include: {
        course: {
          include: {
            teachers: {
              where: {
                teacherId: user.userId,
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      return response.status(404).json({ error: 'Assessment not found' });
    }

    if (assessment.course.teachers.length === 0) {
      return response.status(403).json({ error: 'Not assigned to this course' });
    }

    // Handle multipart form data
    // Vercel serverless functions receive the body as Buffer for multipart
    const contentType = request.headers['content-type'] || '';
    
    if (!contentType.includes('application/pdf') && !contentType.includes('multipart/form-data')) {
      // If content-type is application/pdf, body is the raw PDF
      // Otherwise, we need to parse multipart
    }

    // For simplicity, expect the raw PDF body with appropriate headers
    // Client should send:
    // - Content-Type: application/pdf
    // - X-File-Name: filename.pdf
    
    const fileName = request.headers['x-file-name'] as string || 'assessment.pdf';
    const mimeType = 'application/pdf';
    
    // Get the body as buffer
    const chunks: Buffer[] = [];
    for await (const chunk of request as any) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    if (fileBuffer.length === 0) {
      return response.status(400).json({ error: 'No file provided' });
    }

    if (fileBuffer.length > MAX_FILE_SIZE) {
      return response.status(400).json({ error: 'File too large. Maximum size is 10MB' });
    }

    // Verify it's a PDF (check magic bytes)
    const pdfMagic = fileBuffer.slice(0, 5).toString();
    if (!pdfMagic.startsWith('%PDF-')) {
      return response.status(400).json({ error: 'Invalid PDF file' });
    }

    // Delete old PDF if exists
    if (assessment.pdfBlobUrl) {
      try {
        await del(assessment.pdfBlobUrl);
      } catch (e) {
        console.warn('Failed to delete old PDF:', e);
      }
    }

    // Upload to Vercel Blob
    const blob = await put(`assessments/${assessmentId}/${fileName}`, fileBuffer, {
      access: 'public',
      contentType: mimeType,
    });

    // Update assessment with PDF metadata
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        pdfBlobUrl: blob.url,
        pdfFileName: fileName,
        pdfMimeType: mimeType,
        updatedAt: new Date(),
      },
    });

    return response.status(200).json({
      success: true,
      pdfBlobUrl: blob.url,
      pdfFileName: fileName,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('PDF upload error:', error);
    return response.status(500).json({ error: 'Failed to upload PDF', message: error.message });
  }
}

// Disable body parsing for raw file upload
export const config = {
  api: {
    bodyParser: false,
  },
};


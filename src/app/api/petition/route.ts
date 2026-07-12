import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { sanitizeHtml, sanitizeEmailContent } from '@/lib/utils/sanitizeHtml';
import { checkRateLimit, getClientIP } from '@/lib/utils/rateLimit';
import { appendSignatureRow, uploadSignatureToR2 } from '@/lib/utils/googleSheets';
import { validateNie, NIE_OR_DNI_FORMAT_REGEX } from '@/lib/utils/validateNie';

const MAX_NAME_LENGTH = 100;
const MAX_SIGNATURE_BYTES = 512_000;
const SIGNATURE_PREFIX = 'data:image/png;base64,';

function getEmailConfig() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT ?? '', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.PETITION_TO_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !toEmail) {
    throw new Error('Missing SMTP environment variables (including PETITION_TO_EMAIL)');
  }
  if (smtpPort !== 465 && smtpPort !== 587) {
    throw new Error('SMTP_PORT must be 465 or 587');
  }

  return {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
    fromEmail: smtpUser,
    toEmail,
  };
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, 'petition');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', retryAfter: rateLimit.remainingTime },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.remainingTime) },
        }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { nombre, apellidos, nie, signatureDataUrl, consent } = body as Record<string, unknown>;

    if (
      typeof nombre !== 'string' ||
      typeof apellidos !== 'string' ||
      typeof nie !== 'string' ||
      typeof signatureDataUrl !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid field types' }, { status: 400 });
    }

    if (!nombre.trim() || !apellidos.trim() || !nie.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (consent !== true) {
      return NextResponse.json({ error: 'RGPD consent is required' }, { status: 400 });
    }

    if (signatureDataUrl.length > MAX_SIGNATURE_BYTES) {
      return NextResponse.json({ error: 'Signature image too large' }, { status: 400 });
    }

    if (!signatureDataUrl.startsWith(SIGNATURE_PREFIX)) {
      return NextResponse.json({ error: 'Invalid signature format' }, { status: 400 });
    }

    const cleanNie = nie.trim().toUpperCase();
    if (!NIE_OR_DNI_FORMAT_REGEX.test(cleanNie)) {
      return NextResponse.json({ error: 'Invalid NIE/DNI format' }, { status: 400 });
    }

    if (!validateNie(cleanNie)) {
      return NextResponse.json({ error: 'Invalid NIE/DNI (checksum failed)' }, { status: 400 });
    }

    const cleanNombre = sanitizeEmailContent(nombre, MAX_NAME_LENGTH);
    const cleanApellidos = sanitizeEmailContent(apellidos, MAX_NAME_LENGTH);
    if (!cleanNombre || !cleanApellidos) {
      return NextResponse.json({ error: 'Name fields cannot be empty' }, { status: 400 });
    }

    const safeNombre = sanitizeHtml(cleanNombre);
    const safeApellidos = sanitizeHtml(cleanApellidos);
    const safeNie = sanitizeHtml(cleanNie);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]!;
    const timeStr = now.toTimeString().split(' ')[0]!;

    const base64Data = signatureDataUrl.slice(SIGNATURE_PREFIX.length);
    const signatureLabel = `${safeNombre}-${safeApellidos}`.replace(/\s+/g, '-').toLowerCase();

    Promise.resolve()
      .then(async () => {
        const signatureUrl = await uploadSignatureToR2(base64Data, signatureLabel);
        await appendSignatureRow({
          nombre: safeNombre,
          apellidos: safeApellidos,
          nie: safeNie,
          date: dateStr,
          time: timeStr,
          signatureUrl,
        });
      })
      .catch((sheetsError) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('R2/Sheets append failed (non-blocking):', sheetsError);
        }
      });

    try {
      const emailConfig = getEmailConfig();

      const transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: emailConfig.auth,
        ...(emailConfig.port === 587 && {
          tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' as const },
        }),
      } as Parameters<typeof nodemailer.createTransport>[0]);

      await transporter.sendMail({
        from: emailConfig.fromEmail,
        to: emailConfig.toEmail,
        subject: `Nueva firma petición — ${safeNombre} ${safeApellidos}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Nueva firma — Petición Línea Zaragoza-Argelia</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Nombre:</strong> ${safeNombre}</p>
              <p><strong>Apellidos:</strong> ${safeApellidos}</p>
              <p><strong>NIE/DNI:</strong> ${safeNie}</p>
              <p><strong>Fecha:</strong> ${dateStr} — ${timeStr}</p>
            </div>
            <p><strong>Firma:</strong></p>
            <img src="cid:signature" alt="Firma" style="border: 1px solid #ddd; border-radius: 4px; max-width: 400px;" />
          </div>
        `,
        attachments: [
          {
            filename: 'firma.png',
            content: base64Data,
            encoding: 'base64',
            cid: 'signature',
          },
        ],
      });
    } catch (emailError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Petition email error:', emailError);
      }
      return NextResponse.json(
        { error: 'Failed to send confirmation. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected petition API error:', error);
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

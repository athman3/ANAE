import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sanitizeHtml, sanitizeEmailContent } from '@/lib/utils/sanitizeHtml';
import { checkRateLimit, getClientIP } from '@/lib/utils/rateLimit';

// Interface for Nodemailer errors
interface NodemailerError extends Error {
  code?: string;
  command?: string;
  response?: string;
}

// Field length limits
const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// Validate and get environment variables
function getEmailConfig() {
  const smtpUser = process.env.SMTP_USER;

  const requiredVars = {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: smtpUser,
    smtpPass: process.env.SMTP_PASS,
    toEmail: process.env.CONTACT_TO_EMAIL,
  };

  // Validate SMTP host
  if (!requiredVars.smtpHost) {
    throw new Error('Missing SMTP_HOST');
  }

  // Validate SMTP port (587 for TLS, 465 for SSL)
  const port = parseInt(requiredVars.smtpPort || '', 10);
  if (!requiredVars.smtpPort || (port !== 587 && port !== 465)) {
    throw new Error('SMTP_PORT must be 587 (TLS) or 465 (SSL)');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!requiredVars.smtpUser || !emailRegex.test(requiredVars.smtpUser)) {
    throw new Error('Invalid SMTP_USER email format');
  }

  if (!requiredVars.smtpPass) {
    throw new Error('Missing SMTP_PASS');
  }

  if (!requiredVars.toEmail || !emailRegex.test(requiredVars.toEmail)) {
    throw new Error('Invalid CONTACT_TO_EMAIL format');
  }

  return {
    host: requiredVars.smtpHost,
    port: port,
    secure: port === 465, // SSL for port 465, TLS for port 587
    auth: {
      user: requiredVars.smtpUser,
      pass: requiredVars.smtpPass,
    },
    tls: port === 587 ? {
      rejectUnauthorized: true, // Reject unauthorized certificates
      minVersion: 'TLSv1.2',
    } : undefined,
    fromEmail: requiredVars.smtpUser, // Use SMTP_USER as sender
    toEmail: requiredVars.toEmail,
  };
}

// Create nodemailer transporter (created once, reused)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  const config = getEmailConfig();

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    ...(config.tls && { tls: config.tls }),
  } as nodemailer.TransportOptions);

  return transporter;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.remainingTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.remainingTime),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate types
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Invalid field types' },
        { status: 400 }
      );
    }

    // Validate and sanitize field lengths
    const sanitizedName = sanitizeEmailContent(name, MAX_NAME_LENGTH);
    const sanitizedSubject = sanitizeEmailContent(subject, MAX_SUBJECT_LENGTH);
    const sanitizedMessage = sanitizeEmailContent(message, MAX_MESSAGE_LENGTH);

    if (sanitizedName.length === 0) {
      return NextResponse.json(
        { error: 'Name cannot be empty' },
        { status: 400 }
      );
    }

    if (sanitizedSubject.length === 0) {
      return NextResponse.json(
        { error: 'Subject cannot be empty' },
        { status: 400 }
      );
    }

    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Sanitize all user inputs for HTML output
    const safeName = sanitizeHtml(sanitizedName);
    const safeEmail = sanitizeHtml(email.trim());
    const safeSubject = sanitizeHtml(sanitizedSubject);
    const safeMessage = sanitizeHtml(sanitizedMessage);

    // Get email configuration
    let emailConfig;
    try {
      emailConfig = getEmailConfig();
      if (process.env.NODE_ENV === 'development') {
        console.log('Email config loaded successfully:', {
          host: emailConfig.host,
          port: emailConfig.port,
          fromEmail: emailConfig.fromEmail,
          toEmail: emailConfig.toEmail,
        });
      }
    } catch (configError) {
      // Log error without exposing sensitive details
      if (process.env.NODE_ENV === 'development') {
        console.error('Email configuration error:', {
          message: configError instanceof Error ? configError.message : 'Unknown error',
          stack: configError instanceof Error ? configError.stack : undefined,
        });
      }
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      );
    }

    // Get transporter
    let transport;
    try {
      transport = getTransporter();
    } catch (transportError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Transport creation error:', transportError instanceof Error ? transportError.message : 'Unknown error');
      }
      return NextResponse.json(
        { error: 'Failed to initialize email service' },
        { status: 500 }
      );
    }

    // Send email using Nodemailer
    try {
      const info = await transport.sendMail({
        from: emailConfig.fromEmail,
        to: emailConfig.toEmail,
        replyTo: safeEmail,
        subject: `Nouveau message de ${safeName} - ${safeSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Nouveau message depuis le formulaire de contact ANAE</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Nom:</strong> ${safeName}</p>
              <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              <p><strong>Sujet:</strong> ${safeSubject}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${safeMessage}</p>
            </div>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Vous pouvez répondre directement à cet email pour contacter ${safeName}.
            </p>
          </div>
        `,
      });

      // Log success (without sensitive data)
      if (process.env.NODE_ENV === 'development') {
        console.log('Email sent successfully:', {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Email sent successfully',
          messageId: info.messageId,
        },
        { status: 200 }
      );
    } catch (emailError) {
      // Log detailed error server-side only
      const nodemailerError = emailError as NodemailerError;
      const errorDetails = {
        message: nodemailerError.message || 'Unknown error',
        code: nodemailerError.code,
        stack: nodemailerError.stack,
        command: nodemailerError.command,
        response: nodemailerError.response,
      };
      if (process.env.NODE_ENV === 'development') {
        console.error('Email sending error:', JSON.stringify(errorDetails, null, 2));
      }

      // Return error details in development mode for debugging
      const isDev = process.env.NODE_ENV === 'development';
      return NextResponse.json(
        { 
          error: 'Failed to send email. Please try again later.',
          ...(isDev && { 
            details: errorDetails.message,
            code: errorDetails.code 
          })
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Catch-all error handler
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected error in contact API:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { google } from 'googleapis';

interface SignatureRow {
  nombre: string;
  apellidos: string;
  nie: string;
  date: string;
  time: string;
  signatureUrl?: string;
}

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing R2 environment variables (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function uploadSignatureToR2(base64Data: string, label: string): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucket) throw new Error('Missing R2_BUCKET_NAME');
  if (!publicUrl) throw new Error('Missing R2_PUBLIC_URL');

  const client = getR2Client();
  const buffer = Buffer.from(base64Data, 'base64');
  const key = `signatures/firma-${label}-${Date.now()}.png`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  const base = publicUrl.replace(/\/$/, '');
  return `${base}/${key}`;
}

function getCredentials(): Record<string, unknown> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON');

  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }
}

export async function appendSignatureRow(row: SignatureRow): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('Missing GOOGLE_SHEET_ID');

  const auth = new google.auth.GoogleAuth({
    credentials: getCredentials(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const signatureCell = row.signatureUrl ? `=IMAGE("${row.signatureUrl}")` : '';

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[row.nombre, row.apellidos, row.nie, row.date, row.time, signatureCell]],
    },
  });
}

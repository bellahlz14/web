import { NextRequest, NextResponse } from 'next/server';
import { getLastInsertId } from '@/lib/db';
import crypto from 'crypto';

const QR_SESSION_TTL = 300; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + QR_SESSION_TTL * 1000);

    await getLastInsertId(
      `INSERT INTO qr_sessions (token, status, expires_at, created_at)
       VALUES (?, ?, ?, NOW())`,
      [token, 'pending', expiresAt.toISOString().split('T')[0] + ' ' + expiresAt.toTimeString().slice(0, 8)]
    );

    return NextResponse.json(
      {
        token,
        expires_at: expiresAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('QR create error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้าง QR' },
      { status: 500 }
    );
  }
}

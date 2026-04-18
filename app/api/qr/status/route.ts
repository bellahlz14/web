import { NextRequest, NextResponse } from 'next/server';
import { fetch } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token จำเป็นต้องระบุ' },
        { status: 400 }
      );
    }

    // Find QR session
    const qrSession: any = await fetch(
      `SELECT account_id, status FROM qr_sessions WHERE token = ?`,
      [token]
    );

    if (!qrSession) {
      return NextResponse.json(
        { error: 'QR session ไม่พบ' },
        { status: 404 }
      );
    }

    // If confirmed, get subscription info
    let expireAt = null;
    if (qrSession.status === 'confirmed' && qrSession.account_id) {
      const subscription: any = await fetch(
        `SELECT expire_at FROM subscriptions WHERE account_id = ? ORDER BY expire_at DESC LIMIT 1`,
        [qrSession.account_id]
      );
      if (subscription) {
        expireAt = subscription.expire_at;
      }
    }

    return NextResponse.json(
      {
        status: qrSession.status,
        account_id: qrSession.account_id,
        expire_at: expireAt,
        server_time: Math.floor(Date.now() / 1000),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('QR status error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}

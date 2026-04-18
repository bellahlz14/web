import { NextRequest, NextResponse } from 'next/server';
import { execute, fetch } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, account_id } = body;

    if (!token || !account_id) {
      return NextResponse.json(
        { error: 'Token และ Account ID จำเป็นต้องระบุ' },
        { status: 400 }
      );
    }

    // Verify QR session exists and is not expired
    const qrSession: any = await fetch(
      `SELECT id, expires_at FROM qr_sessions WHERE token = ?`,
      [token]
    );

    if (!qrSession) {
      return NextResponse.json(
        { error: 'QR session ไม่พบ' },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(qrSession.expires_at);

    if (expiresAt <= now) {
      return NextResponse.json(
        { error: 'QR session หมดอายุแล้ว' },
        { status: 401 }
      );
    }

    // Update QR session status
    await execute(
      'UPDATE qr_sessions SET status = ?, account_id = ? WHERE token = ?',
      ['confirmed', account_id, token]
    );

    return NextResponse.json(
      { success: true, message: 'ยืนยัน QR สำเร็จ' },
      { status: 200 }
    );
  } catch (error) {
    console.error('QR confirm error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}

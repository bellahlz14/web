import { NextRequest, NextResponse } from 'next/server';
import { fetch } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const deviceId = request.nextUrl.searchParams.get('deviceid');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID จำเป็นต้องระบุ' },
        { status: 400 }
      );
    }

    // Find device session and subscription
    const result: any = await fetch(
      `SELECT s.expire_at
       FROM device_sessions ds
       JOIN subscriptions s ON ds.account_id = s.account_id
       WHERE ds.deviceid = ? AND ds.is_active = 1
       ORDER BY s.expire_at DESC LIMIT 1`,
      [deviceId]
    );

    const now = new Date();
    const serverTime = Math.floor(Date.now() / 1000);

    if (!result) {
      return NextResponse.json(
        {
          active: false,
          server_time: serverTime,
        },
        { status: 200 }
      );
    }

    const expireAt = new Date(result.expire_at);
    const isActive = expireAt > now;

    return NextResponse.json(
      {
        active: isActive,
        expire_at: result.expire_at,
        server_time: serverTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}

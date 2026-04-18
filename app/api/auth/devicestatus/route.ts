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

    // Find device session
    const session: any = await fetch(
      `SELECT a.id, a.username, ds.account_id, s.expire_at
       FROM device_sessions ds
       JOIN accounts a ON ds.account_id = a.id
       LEFT JOIN subscriptions s ON a.id = s.account_id
       WHERE ds.deviceid = ? AND ds.is_active = 1
       ORDER BY s.expire_at DESC LIMIT 1`,
      [deviceId]
    );

    if (!session) {
      return NextResponse.json(
        {
          registered: false,
          server_time: Math.floor(Date.now() / 1000),
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        registered: true,
        account_id: session.id,
        username: session.username,
        expire_at: session.expire_at,
        server_time: Math.floor(Date.now() / 1000),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Device status error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}

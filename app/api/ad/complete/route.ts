import { NextRequest, NextResponse } from 'next/server';
import { fetch, execute, getLastInsertId } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceid, ad_token } = body;

    if (!deviceid || !ad_token) {
      return NextResponse.json(
        { error: 'Device ID และ AD Token จำเป็นต้องระบุ' },
        { status: 400 }
      );
    }

    // Find device session
    const session: any = await fetch(
      `SELECT a.id, ds.account_id FROM device_sessions ds
       JOIN accounts a ON ds.account_id = a.id
       WHERE ds.deviceid = ? AND ds.is_active = 1`,
      [deviceid]
    );

    if (!session) {
      return NextResponse.json(
        { error: 'Device ไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    const accountId = session.account_id;
    const minutesPerAd = 30;

    // Grant time
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + minutesPerAd);

    await getLastInsertId(
      `INSERT INTO subscriptions (account_id, expire_at, granted_by, created_at)
       VALUES (?, ?, ?, NOW())`,
      [accountId, expireAt.toISOString().split('T')[0] + ' 23:59:59', 'ad_watch']
    );

    // Record ad watch
    await getLastInsertId(
      `INSERT INTO ad_watches (account_id, deviceid, ad_token, minutes_granted, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [accountId, deviceid, ad_token, minutesPerAd]
    );

    return NextResponse.json(
      {
        success: true,
        message: `ได้รับเวลาเพิ่ม ${minutesPerAd} นาที`,
        expire_at: expireAt,
        minutes_granted: minutesPerAd,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ad complete error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}

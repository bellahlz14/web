import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { fetch, getLastInsertId } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, deviceid, device_name, app_os, app_version } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' },
        { status: 400 }
      );
    }

    // Find user
    const user: any = await fetch(
      'SELECT id, username, password_hash FROM accounts WHERE username = ?',
      [username]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Check subscription
    const subscription: any = await fetch(
      'SELECT expire_at FROM subscriptions WHERE account_id = ? ORDER BY expire_at DESC LIMIT 1',
      [user.id]
    );

    if (!subscription) {
      return NextResponse.json(
        { error: 'ไม่พบสิทธิ์การใช้งาน' },
        { status: 403 }
      );
    }

    const expireAt = new Date(subscription.expire_at);
    const now = new Date();

    if (expireAt <= now) {
      return NextResponse.json(
        { error: 'สิทธิ์การใช้งานหมดอายุแล้ว' },
        { status: 403 }
      );
    }

    // Link device if provided
    if (deviceid) {
      await getLastInsertId(
        `INSERT INTO device_sessions (account_id, deviceid, device_name, app_os, app_version, linked_at, last_seen_at, is_active)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 1)
         ON DUPLICATE KEY UPDATE account_id = ?, is_active = 1, last_seen_at = NOW()`,
        [user.id, deviceid, device_name || 'My Device', app_os || 'unknown', app_version || '1.0.0', user.id]
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        account_id: user.id,
        username: user.username,
        expire_at: expireAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}

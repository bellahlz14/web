import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { fetch, getLastInsertId } from '@/lib/db';
import { validateEmail, validatePassword, validatePasswordMatch, validateUsername } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, password_confirm, deviceid, device_name, app_os, app_version } = body;

    // Validation
    if (!username || !email || !password || !password_confirm) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Validate username
    const usernameCheck = validateUsername(username);
    if (!usernameCheck.valid) {
      return NextResponse.json({ error: usernameCheck.error }, { status: 400 });
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'อีเมลไม่ถูกต้อง' }, { status: 400 });
    }

    // Validate password
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.error }, { status: 400 });
    }

    // Check password match
    if (!validatePasswordMatch(password, password_confirm)) {
      return NextResponse.json(
        { error: 'รหัสผ่านไม่ตรงกัน' },
        { status: 400 }
      );
    }

    // Check if username exists
    const existingUser = await fetch('SELECT id FROM accounts WHERE username = ?', [username]);
    if (existingUser) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create account
    const accountId = await getLastInsertId(
      'INSERT INTO accounts (username, password_hash, email, created_at) VALUES (?, ?, ?, NOW())',
      [username, passwordHash, email]
    );

    // Grant 7 days trial subscription
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7);

    await getLastInsertId(
      'INSERT INTO subscriptions (account_id, expire_at, granted_by, created_at) VALUES (?, ?, ?, NOW())',
      [accountId, expireAt.toISOString().split('T')[0] + ' 23:59:59', 'trial']
    );

    // Link device if provided
    if (deviceid) {
      await getLastInsertId(
        `INSERT INTO device_sessions (account_id, deviceid, device_name, app_os, app_version, linked_at, is_active)
         VALUES (?, ?, ?, ?, ?, NOW(), 1)
         ON DUPLICATE KEY UPDATE account_id = ?, is_active = 1, linked_at = NOW()`,
        [accountId, deviceid, device_name || 'My Device', app_os || 'unknown', app_version || '1.0.0', accountId]
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'ลงทะเบียนสำเร็จ',
        account_id: accountId,
        username: username,
        expire_at: expireAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
}

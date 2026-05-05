import { NextRequest, NextResponse } from 'next/server';
import { fetch, execute } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้และ email จำเป็น' },
        { status: 400 }
      );
    }

    // Find user by username and email
    const user = await fetch(
      'SELECT id FROM users WHERE username = ? AND email = ?',
      [username, email]
    ) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือ email ไม่ถูกต้อง' },
        { status: 404 }
      );
    }

    // Generate reset token (valid for 30 minutes)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    try {
      // Store reset token in database
      await execute(
        'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, token, expiresAt]
      );
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      // If table doesn't exist, return token anyway (for testing)
      // In production, create the table first
    }

    return NextResponse.json(
      {
        message: 'ยืนยันข้อมูลสำเร็จ',
        token: token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error.message);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}

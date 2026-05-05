import { NextRequest, NextResponse } from 'next/server';
import { fetch, execute } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { username, token, newPassword } = await request.json();

    if (!username || !token || !newPassword) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบ' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      );
    }

    // Find user
    const user = await fetch(
      'SELECT id FROM users WHERE username = ?',
      [username]
    ) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้' },
        { status: 404 }
      );
    }

    // Find and verify reset token
    const resetRecord = await fetch(
      'SELECT id FROM password_resets WHERE user_id = ? AND token = ? AND expires_at > NOW()',
      [user.id, token]
    ) as any;

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'ลิงค์รีเซ็ตหมดอายุหรือไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Hash new password using crypto (simple hash, not bcrypt)
    const hashedPassword = crypto
      .createHash('sha256')
      .update(newPassword)
      .digest('hex');

    // Update user password
    await execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );

    // Delete used reset token
    await execute(
      'DELETE FROM password_resets WHERE id = ?',
      [resetRecord.id]
    );

    return NextResponse.json(
      { message: 'ตั้งรหัสผ่านใหม่สำเร็จ' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}

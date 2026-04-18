import { NextRequest, NextResponse } from 'next/server';
import { execute } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceid } = body;

    if (!deviceid) {
      return NextResponse.json(
        { error: 'Device ID จำเป็นต้องระบุ' },
        { status: 400 }
      );
    }

    await execute(
      'UPDATE device_sessions SET is_active = 0 WHERE deviceid = ?',
      [deviceid]
    );

    return NextResponse.json(
      { success: true, message: 'ยกเลิกการเชื่อมต่ออุปกรณ์สำเร็จ' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unlink device error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { execute } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceid, device_name } = body;

    if (!deviceid || !device_name) {
      return NextResponse.json(
        { error: 'Device ID และ Device Name จำเป็นต้องระบุ' },
        { status: 400 }
      );
    }

    await execute(
      'UPDATE device_sessions SET device_name = ? WHERE deviceid = ?',
      [device_name, deviceid]
    );

    return NextResponse.json(
      { success: true, message: 'ตั้งชื่ออุปกรณ์สำเร็จ' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Set device name error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}

const mysql = require('mysql2/promise');

async function deleteAllData() {
  const connection = await mysql.createConnection({
    host: '103.245.164.118',
    user: 'admin_thaiiptvfree',
    password: '5SswH3g9duWH8Z8TASSE',
    database: 'admin_thaiiptvfree',
  });

  try {
    console.log('🗑️ กำลังลบข้อมูลทั้งหมด...\n');

    // ลบแต่ละตาราง
    const tables = ['ad_watches', 'qr_sessions', 'subscriptions', 'device_sessions', 'accounts'];

    for (const table of tables) {
      await connection.execute(`DELETE FROM ${table}`);
      console.log(`✅ ลบ ${table} สำเร็จ`);
    }

    console.log('\n📊 ตรวจสอบจำนวนแถว:');

    // ตรวจสอบแต่ละตาราง
    for (const table of tables) {
      const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`${table}: ${rows[0].count} แถว`);
    }

    console.log('\n✨ เสร็จสิ้น!');
  } catch (error) {
    console.error('❌ ข้อผิดพลาด:', error.message);
  } finally {
    await connection.end();
  }
}

deleteAllData();

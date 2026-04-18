'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Thai IPTV</h1>
        <p className={styles.subtitle}>ดูทีวีสดและหนังออนไลน์</p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.btnPrimary}>
            เข้าสู่ระบบ
          </Link>

          <Link href="/register" className={styles.btnSecondary}>
            ลงทะเบียน
          </Link>

          <Link href="/watch-ad" className={styles.btnGhost}>
            ดูโฆษณา (รับเวลา)
          </Link>
        </div>

        <div className={styles.info}>
          <h3>ประโยชน์สมาชิก</h3>
          <ul>
            <li>✓ ดูทีวีสดกว่า 100 ช่อง</li>
            <li>✓ หนังและซีรี่ย์นับหมื่นเรื่อง</li>
            <li>✓ ดูบน TV, Phone, Tablet</li>
            <li>✓ รับเวลาเพิ่มจากโฆษณา</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

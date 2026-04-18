'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function WatchAdPage() {
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!deviceId.trim()) {
      setError('กรุณากรอก Device ID');
      return;
    }

    setSubmitted(true);
  };

  if (submitted && deviceId) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>ดูโฆษณาเพื่อรับเวลา</h1>
          <p className={styles.subtitle}>Device: {deviceId}</p>

          <div className={styles.adFrame}>
            <iframe
              width="100%"
              height="400"
              src={`/ad?deviceid=${encodeURIComponent(deviceId)}&token=web_token_${Date.now()}`}
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
              className={styles.iframe}
            />
          </div>

          <button
            className={styles.backBtn}
            onClick={() => setSubmitted(false)}
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>ดูโฆษณาเพื่อรับเวลา</h1>
        <p className={styles.subtitle}>
          ดูโฆษณา 30 วินาที เพื่อรับเวลาใช้งาน 30 นาที
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Device ID</label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="กรอก Device ID ของคุณ"
              className={styles.input}
            />
            <p className={styles.help}>
              ได้รับ Device ID จากแอปพลิเคชันหรือ QR code
            </p>
          </div>

          <button type="submit" className={styles.submitBtn}>
            ดูโฆษณา
          </button>
        </form>

        <div className={styles.divider}>หรือ</div>

        <Link href="/ad?deviceid=demo&token=demo" className={styles.demoBtn}>
          ทดลองดู (Demo)
        </Link>

        <div className={styles.footer}>
          <p>มีบัญชีแล้ว? <Link href="/login">เข้าสู่ระบบ</Link></p>
          <p>ยังไม่มีบัญชี? <Link href="/register">ลงทะเบียน</Link></p>
        </div>
      </div>
    </div>
  );
}

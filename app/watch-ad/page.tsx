'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function WatchAdPage() {
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [message, setMessage] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!deviceId.trim()) {
      setError('กรุณากรอก Device ID');
      return;
    }

    setSubmitted(true);
    setTimeLeft(30);
    setMessage('');
  };

  useEffect(() => {
    if (!submitted || timeLeft < 0) return;

    if (timeLeft === 0) {
      completeAd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const completeAd = async () => {
    if (isCompleting) return;
    setIsCompleting(true);

    try {
      const response = await fetch('/api/ad/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceid: deviceId,
          ad_token: `web_token_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✓ ขอบคุณ! ได้รับเวลา 30 นาที');
      } else {
        setMessage(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsCompleting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>ดูโฆษณาเพื่อรับเวลา</h1>
          <p className={styles.subtitle}>Device: {deviceId}</p>

          {message ? (
            <div className={styles.message}>{message}</div>
          ) : (
            <>
              <div className={styles.adContent}>
                <div className={styles.placeholder}>
                  <p>โฆษณาจะปรากฏที่นี่</p>
                  <p className={styles.smallText}>(แสดงภาพแทนโฆษณาจริง)</p>
                </div>
              </div>

              <div className={styles.timer}>
                <div className={styles.timerDisplay}>{timeLeft}s</div>
                <p>เวลาเหลือ: {timeLeft} วินาที</p>
              </div>

              <div className={styles.info}>
                <p>หลังจากดูโฆษณาเสร็จ คุณจะได้รับเวลาใช้งานเพิ่ม 30 นาที</p>
              </div>
            </>
          )}

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

        <div className={styles.footer}>
          <p>มีบัญชีแล้ว? <Link href="/login">เข้าสู่ระบบ</Link></p>
          <p>ยังไม่มีบัญชี? <Link href="/register">ลงทะเบียน</Link></p>
        </div>
      </div>
    </div>
  );
}

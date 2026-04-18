'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function AdPage() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get('deviceid') || '';
  const adToken = searchParams.get('token') || '';

  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleting, setIsCompleting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (timeLeft <= 0) {
      completeAd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const completeAd = async () => {
    if (isCompleting || !deviceId || !adToken) return;
    setIsCompleting(true);

    try {
      const response = await fetch('/api/ad/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceid: deviceId, ad_token: adToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('ขอบคุณสำหรับการดูโฆษณา! ได้รับเวลาเพิ่ม 30 นาที');
      } else {
        setMessage(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.adContainer}>
        <h1>โฆษณา</h1>

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
      </div>
    </div>
  );
}

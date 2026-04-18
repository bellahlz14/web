'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const QRCode = dynamic(() => import('qrcode.react'), { ssr: false });

export default function QrAuthPage() {
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    const initQr = async () => {
      try {
        const response = await fetch('/api/qr/create', { method: 'POST' });
        const data = await response.json();

        if (response.ok) {
          setToken(data.token);
          setLoading(false);
          setPolling(true);
        } else {
          setError(data.error || 'เกิดข้อผิดพลาด');
          setLoading(false);
        }
      } catch (err) {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
        setLoading(false);
      }
    };

    initQr();
  }, []);

  // Poll for QR confirmation
  useEffect(() => {
    if (!polling || !token) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/qr/status?token=${token}`);
        const data = await response.json();

        if (response.ok && data.status === 'confirmed') {
          setPolling(false);
          setMessage('ยืนยัน QR สำเร็จ! กำลังเปลี่ยนหน้า...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [polling, token, router]);

  const qrUrl = token
    ? `${window.location.origin}/qr-scan?token=${token}`
    : '';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>สแกน QR เพื่อเข้าสู่ระบบ</h1>

        {message && <div className={styles.message}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>กำลังสร้าง QR Code...</p>
          </div>
        ) : token ? (
          <>
            <div className={styles.qrContainer}>
              <QRCode value={qrUrl} size={256} level="H" includeMargin={true} />
            </div>
            <p className={styles.instruction}>
              สแกน QR Code ด้วยสมาร์ทโฟนหรืออุปกรณ์อื่น เพื่อเข้าสู่ระบบ
            </p>
            {polling && (
              <p className={styles.waiting}>
                รอการยืนยัน... (โปรดสแกน QR Code)
              </p>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

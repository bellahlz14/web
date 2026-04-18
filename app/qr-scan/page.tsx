'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function QrScanPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [accountId, setAccountId] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    // Get logged-in user info from localStorage or session
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setAccountId(user.account_id);
        setUsername(user.username);
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลผู้ใช้');
        setLoading(false);
      }
    } else {
      setError('กรุณาเข้าสู่ระบบก่อน');
      setLoading(false);
    }
  }, []);

  const handleConfirm = async () => {
    if (!token || !accountId) {
      setError('ข้อมูลไม่สมบูรณ์');
      return;
    }

    setConfirming(true);
    try {
      const response = await fetch('/api/qr/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, account_id: accountId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('ยืนยัน QR สำเร็จ! อุปกรณ์ได้เชื่อมต่อแล้ว');
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setConfirming(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.error}>QR Token ไม่พบ</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>ยืนยันการเชื่อมต่อ</h1>

        {message && <div className={styles.message}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>กำลังโหลด...</p>
          </div>
        ) : accountId && username ? (
          <>
            <div className={styles.info}>
              <p>
                <strong>ผู้ใช้:</strong> {username}
              </p>
              <p className={styles.subText}>
                กำลังเชื่อมต่ออุปกรณ์กับบัญชีของคุณ
              </p>
            </div>

            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={confirming || !!message}
            >
              {confirming ? 'กำลังยืนยัน...' : 'ยืนยัน'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const QRCode = dynamic(() => import('qrcode.react'), { ssr: false });

export default function QrAuthPage() {
  const searchParams = useSearchParams();
  const paramToken = searchParams.get('token') || '';

  const [token, setToken] = useState<string>(paramToken);
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(!paramToken);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(!!paramToken);
  const [confirmingDevice, setConfirmingDevice] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ตรวจสอบการ login
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        JSON.parse(userStr);
        setIsLoggedIn(true);
      } catch {
        setError('ข้อมูลผู้ใช้ไม่ถูกต้อง');
      }
    } else {
      setError('กรุณา เข้าสู่ระบบ ก่อน');
    }
  }, []);

  // สร้าง QR ใหม่ถ้าไม่มี token
  useEffect(() => {
    if (paramToken) {
      setToken(paramToken);
      setPolling(true);
      setLoading(false);
      return;
    }

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
  }, [paramToken]);

  // Poll for QR confirmation
  useEffect(() => {
    if (!polling || !token) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/qr/status?token=${token}`);
        const data = await response.json();

        if (response.ok && data.status === 'confirmed') {
          setPolling(false);
          setMessage('ยืนยัน QR สำเร็จ! อุปกรณ์เชื่อมต่อแล้ว');
          setTimeout(() => {
            window.close();
          }, 2000);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [polling, token]);

  const handleCheckStatus = async () => {
    if (!token) return;

    try {
      const response = await fetch(`/api/qr/status?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        if (data.status === 'confirmed') {
          setMessage('✓ ยืนยันแล้ว!');
        } else if (data.status === 'pending') {
          setMessage('⏳ รอการสแกน...');
        }
      }
    } catch (err) {
      setError('ไม่สามารถตรวจสอบสถานะ');
    }
  };

  const handleConfirmDevice = async () => {
    if (!token || !deviceName.trim()) {
      setError('กรุณากรอกชื่ออุปกรณ์');
      return;
    }

    setConfirmingDevice(true);
    try {
      // Get logged-in user info
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('ต้องเข้าสู่ระบบก่อน');
        setConfirmingDevice(false);
        return;
      }

      const user = JSON.parse(userStr);
      const response = await fetch('/api/qr/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          account_id: user.account_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✓ ยืนยันการเชื่อมต่อแล้ว!');
        setError('');
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('ไม่สามารถยืนยันการเชื่อมต่อ');
    } finally {
      setConfirmingDevice(false);
    }
  };

  const qrUrl = token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/qr-scan?token=${token}`
    : '';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>เชื่อมต่อ TV</h1>
        <p className={styles.subtitle}>สแกน QR code ด้วยรีโมท TV ของคุณ</p>

        {message && <div className={styles.message}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!isLoggedIn ? (
          <div className={styles.notLoggedIn}>
            <p>⚠️ กรุณา เข้าสู่ระบบ ก่อนเชื่อมต่ออุปกรณ์</p>
          </div>
        ) : loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>กำลังสร้าง QR Code...</p>
          </div>
        ) : token ? (
          <>
            <div className={styles.section}>
              <h3>QR Code</h3>
              <div className={styles.qrContainer}>
                <QRCode value={qrUrl} size={256} level="H" includeMargin={true} />
              </div>
              {polling && (
                <p className={styles.waiting}>
                  ⏳ รอการสแกน...
                </p>
              )}
            </div>

            <div className={styles.section}>
              <h3>ตั้งชื่ออุปกรณ์</h3>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="เช่น Living Room TV"
                  className={styles.input}
                />
              </div>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmDevice}
                disabled={confirmingDevice}
              >
                {confirmingDevice ? 'กำลังยืนยัน...' : 'ยืนยันการเชื่อมต่อ'}
              </button>
            </div>

            <button
              className={styles.statusBtn}
              onClick={handleCheckStatus}
            >
              ตรวจสอบสถานะ
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

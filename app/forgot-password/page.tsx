'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'ชื่อผู้ใช้หรือ email ไม่ถูกต้อง');
        return;
      }

      setResetToken(data.token);
      setSuccess('ยืนยันข้อมูลสำเร็จ! กรุณาตั้งรหัสผ่านใหม่');
      setStep('reset');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          token: resetToken,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด');
        return;
      }

      setSuccess('ตั้งรหัสผ่านใหม่สำเร็จ!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>ลืมรหัสผ่าน</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {step === 'verify' ? (
          <form onSubmit={handleVerify}>
            <p className={styles.subtitle}>กรุณาใส่ชื่อผู้ใช้และ email ที่สมัคร</p>

            <div className="form-group">
              <label>ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <p className={styles.subtitle}>ตั้งรหัสผ่านใหม่</p>

            <div className="form-group">
              <label>รหัสผ่านใหม่</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'กำลังตั้งรหัส...' : 'ตั้งรหัสผ่านใหม่'}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <Link href="/login">กลับไปเข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}

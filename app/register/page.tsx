'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด');
        return;
      }

      setSuccess('ลงทะเบียนสำเร็จ! ไปดูโฆษณาเพื่อรับเวลาใช้งาน');
      setFormData({ username: '', email: '', password: '', password_confirm: '', code: '' });
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>ลงทะเบียน</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {!success ? (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ชื่อผู้ใช้</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                />
              </div>

              <div className="form-group">
                <label>อีเมล</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>รหัสผ่าน</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>ยืนยันรหัสผ่าน</label>
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>รหัสลงทะเบียน (Code)</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
              </button>
            </form>

            <div className={styles.footer}>
              มีบัญชีแล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
            </div>
          </>
        ) : (
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✓</div>
            <p>กรุณาไป <Link href="/watch-ad">ดูโฆษณา</Link> เพื่อรับเวลาใช้งาน</p>
          </div>
        )}
      </div>
    </div>
  );
}

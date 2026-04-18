'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface User {
  account_id: number;
  username: string;
  expire_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        setMessage('ไม่สามารถโหลดข้อมูลผู้ใช้');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setMessage('ออกจากระบบสำเร็จ');
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.error}>กรุณาเข้าสู่ระบบ</p>
        </div>
      </div>
    );
  }

  const expireAt = new Date(user.expire_at);
  const now = new Date();
  const isExpired = expireAt <= now;
  const daysLeft = Math.ceil(
    (expireAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>แดชบอร์ด</h1>

        {message && <div className={styles.message}>{message}</div>}

        <div className={styles.userInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>ชื่อผู้ใช้:</span>
            <span className={styles.value}>{user.username}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>ID:</span>
            <span className={styles.value}>{user.account_id}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>วันหมดอายุ:</span>
            <span className={isExpired ? styles.expired : styles.active}>
              {expireAt.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {!isExpired && (
            <div className={styles.infoItem}>
              <span className={styles.label}>เหลือ:</span>
              <span className={styles.active}>{daysLeft} วัน</span>
            </div>
          )}
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

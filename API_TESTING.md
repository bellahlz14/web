# API Testing Guide

## Environment Setup

Before testing, ensure .env.local is configured with database credentials:
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=admin_thaiiptvfree
DB_PORT=3306
```

Start the development server:
```bash
npm run dev
```

Server runs on http://localhost:3000

---

## Authentication Endpoints

### 1. POST /api/auth/register

Register a new account

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "password_confirm": "Password123"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "ลงทะเบียนสำเร็จ",
  "account_id": 1,
  "username": "testuser",
  "expire_at": "2026-04-25T07:00:00.000Z"
}
```

**With Device (Mobile):**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "password_confirm": "Password123",
    "deviceid": "android_device_123",
    "device_name": "My Android Phone",
    "app_os": "Android",
    "app_version": "1.0.0"
  }'
```

---

### 2. POST /api/auth/login

Login with credentials

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "account_id": 1,
  "username": "testuser",
  "expire_at": "2026-04-25T07:00:00.000Z"
}
```

**With Device (Mobile):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123",
    "deviceid": "android_device_123",
    "device_name": "My Android Phone",
    "app_os": "Android",
    "app_version": "1.0.0"
  }'
```

---

### 3. GET /api/auth/devicestatus

Check if a device is registered

**Request:**
```bash
curl "http://localhost:3000/api/auth/devicestatus?deviceid=android_device_123"
```

**Response (200) - Registered:**
```json
{
  "registered": true,
  "account_id": 1,
  "username": "testuser",
  "expire_at": "2026-04-25T07:00:00.000Z",
  "server_time": 1719141600
}
```

**Response (200) - Not Registered:**
```json
{
  "registered": false,
  "server_time": 1719141600
}
```

---

### 4. GET /api/auth/subscriptioncheck

Check subscription status

**Request:**
```bash
curl "http://localhost:3000/api/auth/subscriptioncheck?deviceid=android_device_123"
```

**Response (200) - Active:**
```json
{
  "active": true,
  "expire_at": "2026-04-25T07:00:00.000Z",
  "server_time": 1719141600
}
```

**Response (200) - Expired:**
```json
{
  "active": false,
  "server_time": 1719141600
}
```

---

### 5. POST /api/auth/setdevicename

Set device friendly name

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/setdevicename \
  -H "Content-Type: application/json" \
  -d '{
    "deviceid": "android_device_123",
    "device_name": "Living Room TV"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "ตั้งชื่ออุปกรณ์สำเร็จ"
}
```

---

### 6. POST /api/auth/unlinkdevice

Unlink a device from account

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/unlinkdevice \
  -H "Content-Type: application/json" \
  -d '{
    "deviceid": "android_device_123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "ยกเลิกการเชื่อมต่ออุปกรณ์สำเร็จ"
}
```

---

## QR Code Endpoints

### 7. POST /api/qr/create

Create a new QR session

**Request:**
```bash
curl -X POST http://localhost:3000/api/qr/create
```

**Response (200):**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "expires_at": "2026-04-18T07:10:00.000Z"
}
```

---

### 8. GET /api/qr/status

Check QR session status

**Request:**
```bash
curl "http://localhost:3000/api/qr/status?token=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

**Response (200) - Pending:**
```json
{
  "status": "pending",
  "account_id": null,
  "expire_at": null,
  "server_time": 1719141600
}
```

**Response (200) - Confirmed:**
```json
{
  "status": "confirmed",
  "account_id": 1,
  "expire_at": "2026-04-25T07:00:00.000Z",
  "server_time": 1719141600
}
```

---

### 9. POST /api/qr/confirm

Confirm QR login (called from web)

**Request:**
```bash
curl -X POST http://localhost:3000/api/qr/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "account_id": 1
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "ยืนยัน QR สำเร็จ"
}
```

---

## Ad System Endpoints

### 10. POST /api/ad/complete

Complete ad watch and grant minutes

**Request:**
```bash
curl -X POST http://localhost:3000/api/ad/complete \
  -H "Content-Type: application/json" \
  -d '{
    "deviceid": "android_device_123",
    "ad_token": "some_ad_token_123456"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "ได้รับเวลาเพิ่ม 30 นาที",
  "expire_at": "2026-04-25T07:30:00.000Z",
  "minutes_granted": 30
}
```

---

## Web Flow Testing

### Register User
1. Visit http://localhost:3000/register
2. Fill form and submit
3. Check success message
4. Login with new account at /login

### Login User
1. Visit http://localhost:3000/login
2. Enter credentials
3. Check dashboard shows user info

### QR Device Pairing
1. Login at http://localhost:3000/login
2. Go to http://localhost:3000/qr-auth
3. Scan QR with mobile device
4. Visit /qr-scan?token=... on mobile browser
5. Click confirm
6. Check qr-auth page shows success

### Ad Watching
1. Visit http://localhost:3000/ad?deviceid=test&token=test
2. Watch countdown from 30 seconds
3. Check success message after countdown

---

## Error Testing

### Invalid Credentials
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wronguser",
    "password": "wrongpass"
  }'
```

Expected: 401 error "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"

### Missing Parameters
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test"}'
```

Expected: 400 error "กรุณากรอกข้อมูลให้ครบถ้วน"

### Invalid Email
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "invalid-email",
    "password": "Pass123",
    "password_confirm": "Pass123"
  }'
```

Expected: 400 error "อีเมลไม่ถูกต้อง"

### Weak Password
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "12345",
    "password_confirm": "12345"
  }'
```

Expected: 400 error "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"

---

## Production Deployment Checklist

- [ ] Database is accessible from Vercel
- [ ] All environment variables are set in Vercel dashboard
- [ ] Database connection pooling is configured
- [ ] Error logging is enabled
- [ ] HTTPS is enforced
- [ ] Rate limiting is considered
- [ ] Backup strategy for database
- [ ] Monitor error logs
- [ ] Test QR code flows on production
- [ ] Test ad completion on production

# คู่มือ Deploy ขึ้น Vercel (ตั้งแต่เริ่มต้น)

## ขั้นตอนที่ 1: เตรียมพื้นที่เก็บโค้ด (GitHub)

### สร้าง Repository ใหม่บน GitHub

1. เข้า https://github.com/new
2. กรอกข้อมูล:
   - **Repository name**: `thai-iptv-web` (หรือชื่ออื่นตามใจ)
   - **Description**: `Thai IPTV Web App - Next.js`
   - **Private/Public**: เลือก **Public** (ให้ Vercel อ่านได้)
   - **Initialize with README**: ไม่ต้อง (เรามี README แล้ว)
3. คลิก **Create repository**

จะได้ URL แบบนี้: `https://github.com/YOUR_USERNAME/thai-iptv-web`

---

## ขั้นตอนที่ 2: Push Code ขึ้น GitHub

### ใน Terminal/Command Prompt:

```bash
# ไปที่โฟลเดอร์ nextjs-web
cd /Users/skycos/Desktop/appcodethaiiptvfree/apigenrb/nextjs-web

# Initialize git (ถ้ายังไม่มี)
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit code
git commit -m "Initial commit: Thai IPTV Next.js app"

# เพิ่ม remote (แทน YOUR_USERNAME ด้วยชื่อ GitHub ของคุณ)
git remote add origin https://github.com/bellahlz14/web.git

# Push ขึ้น GitHub (ครั้งแรก)
git branch -M main
git push -u origin main
```

**ผลลัพธ์**: โค้ดทั้งหมด push ขึ้น GitHub แล้ว

---

## ขั้นตอนที่ 3: สร้างบัญชี Vercel

### วิธีที่ 1: ใช้ GitHub (แนะนำ - ง่ายสุด)

1. เข้า https://vercel.com
2. คลิก **Sign Up**
3. เลือก **Continue with GitHub**
4. Login GitHub ของคุณ
5. Vercel จะขอ authorize → คลิก **Authorize**
6. Setup ชื่อ Team (ใช้ default ได้)

✅ เสร็จ! Vercel เชื่อมต่อกับ GitHub แล้ว

---

## ขั้นตอนที่ 4: Deploy จาก GitHub

### วิธี A: ใน Vercel Dashboard (ง่ายสุด)

1. ไปที่ https://vercel.com/dashboard
2. คลิก **+ New Project** (ขวาบน)
3. **Select a Git Repository** → เลือก repository ที่เพิ่งสร้าง `thai-iptv-web`
   - ถ้าไม่เห็น → คลิก **Import Git Repository** → copy URL GitHub → paste
4. ตรวจสอบ:
   - **Framework**: Next.js (ต้องเลือก)
   - **Root Directory**: `apigenrb/nextjs-web/` (หรือที่เก็บ nextjs-web)
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
5. คลิก **Deploy** → รอ... (ประมาณ 2-3 นาที)

✅ Vercel deploy เสร็จแล้ว! คุณจะได้ URL เหมือน:
```
https://thai-iptv-web.vercel.app
```

---

## ขั้นตอนที่ 5: ตั้งค่า Environment Variables

### ทำบน Vercel Dashboard:

1. ไปที่ Project Settings:
   - Dashboard → Project ของคุณ → **Settings** (ขวาบน)
   
2. ไปที่ **Environment Variables** (ด้านซ้าย)

3. เพิ่มตัวแปรนี้:
   ```
   DB_HOST        = your_db_host
   DB_USER        = your_db_user
   DB_PASSWORD    = your_db_password
   DB_NAME        = admin_thaiiptvfree
   DB_PORT        = 3306
   
   NEXT_PUBLIC_API_BASE_URL  = https://thai-iptv-web.vercel.app
   APP_BASE_URL              = https://thai-iptv-web.vercel.app
   
   MINUTES_PER_AD            = 30
   QR_SESSION_TTL            = 300
   SUBSCRIPTION_CHECK_INTERVAL = 60
   ```

4. คลิก **Save**

5. ไปที่ **Deployments** → ค้นหา deployment ล่าสุด → คลิก **Redeploy** (เพื่อให้โหลด env vars)

✅ Environment variables ตั้งค่าเสร็จแล้ว!

---

## ขั้นตอนที่ 6: ทดสอบแอปพลิเคชัน

### ทดสอบบน Production URL:

```
หน้าแรก:      https://thai-iptv-web.vercel.app/
ลงทะเบียน:    https://thai-iptv-web.vercel.app/register
เข้าสู่ระบบ:  https://thai-iptv-web.vercel.app/login
ดูโฆษณา:      https://thai-iptv-web.vercel.app/watch-ad
```

### ทดสอบ API:

```bash
# ทดสอบ Register
curl -X POST https://thai-iptv-web.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "password": "Password123",
    "password_confirm": "Password123"
  }'

# ทดสอบ Login
curl -X POST https://thai-iptv-web.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "Password123"
  }'

# ทดสอบ QR Create
curl -X POST https://thai-iptv-web.vercel.app/api/qr/create
```

✅ ถ้าได้ response แปลว่า API ทำงานสบาย!

---

## ขั้นตอนที่ 7: Update Code (ทีหลัง)

ทุกครั้งที่อยากอัพเดต code:

```bash
# เข้าโฟลเดอร์
cd /Users/skycos/Desktop/appcodethaiiptvfree/apigenrb/nextjs-web

# Edit files...

# Commit
git add .
git commit -m "Fix bug in login page" 

# Push ขึ้น GitHub
git push

# Vercel จะ auto-deploy ใน 30 วินาที!
```

✅ ไม่ต้องทำอะไรเพิ่มเติม - Vercel deploy อัตโนมัติ

---

## ขั้นตอนที่ 8: ตั้งค่า Custom Domain (ตัวเลือก)

ถ้าจะใช้ domain เป็นของตัวเองแทน `.vercel.app`:

### เช่น: `api.yourdomain.com`

1. ใน Vercel Dashboard → Project → **Settings**
2. ไปที่ **Domains**
3. เพิ่ม domain ของคุณ: `api.yourdomain.com`
4. Vercel จะให้ DNS records → คัดลอก
5. ไปที่ DNS provider ของคุณ (Namecheap, Cloudflare, etc.)
6. เพิ่ม DNS records
7. รอ 5-30 นาที
8. Vercel จะแสดง ✅ Connected

---

## ปัญหาเบื้องต้นและวิธีแก้

### ❌ Build Failed

**ปัญหา**: Vercel build fail
**วิธีแก้**:
1. ไปที่ **Deployments** → ล่าสุด → **View Logs**
2. ดูข้อผิดพลาด (ปกติเป็น syntax error หรือ missing package)
3. Fix code → `git push` → auto-redeploy

### ❌ Database Connection Error

**ปัญหา**: API endpoint ตอบว่า connection failed
**วิธีแก้**:
1. ตรวจสอบ DB_HOST ถูกต้องหรือไม่
2. ตรวจสอบ firewall มี IP ของ Vercel หรือไม่
   - สำหรับ Vercel: ต้อง allow all IPs หรือ whitelist IP range
3. ทดสอบ connection ด้วย:
   ```bash
   mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p
   ```

### ❌ Environment Variables Not Working

**ปัญหา**: API ยังหา DB อยู่ (env var ไม่โหลด)
**วิธีแก้**:
1. ตรวจสอบ Environment Variables ใน Vercel Settings
2. คลิก **Redeploy** ที่ deployment ล่าสุด
3. รอ build เสร็จ (ต้องรอบใหม่)

### ❌ QRCode ไม่โชว์

**ปัญหา**: หน้า `/qr-auth` ว่างเปล่า
**วิธีแก้**:
1. ดู Browser Console (F12)
2. ปกติเป็น qrcode.react library error
3. Fix: ตรวจสอบ `npm install` ครบไหม

---

## Vercel Dashboard - ทำความเข้าใจ

### 📊 Deployments
- ดูรายการ deploy ทั้งหมด
- Click deployment → ดู logs
- Click **Redeploy** → deploy ใหม่

### ⚙️ Settings
- **General**: ตั้งค่า framework, build command
- **Environment Variables**: เก็บ DB password, API keys
- **Domains**: ตั้งค่า custom domain
- **Git**: เชื่อมต่อ GitHub repo

### 📈 Analytics
- ดูสถิติการใช้ (requests, latency, etc.)

### 💾 Serverless Functions
- ดูรายละเอียด API route

---

## Checklist ก่อน Deploy

- [ ] โค้ด push ขึ้น GitHub แล้ว
- [ ] Vercel account สร้างแล้ว
- [ ] GitHub repo imported ขึ้น Vercel
- [ ] Environment variables ตั้งค่าแล้ว
- [ ] Database host accessible จาก Vercel
- [ ] Build ผ่านไม่มี error
- [ ] ทดสอบ API endpoints บน production URL
- [ ] Register/login/ad page ทำงาน

---

## คำสั่งที่ใช้บ่อย

```bash
# ดูสถานะ git
git status

# ดูรายการ commits
git log --oneline

# ยกเลิก commit ล่าสุด (ยังไม่ push)
git reset --soft HEAD~1

# ลบ local commits ที่ยังไม่ push
git reset --hard origin/main

# อัพเดท local code จาก GitHub
git pull

# ดูไฟล์ที่เปลี่ยนแปลง
git diff
```

---

## URLs ที่ต้องรู้

| Page | URL |
|------|-----|
| Dashboard | https://vercel.com/dashboard |
| Create Project | https://vercel.com/new |
| Docs | https://vercel.com/docs |
| Status | https://vercel.com/status |

---

## Summary - ขั้นตอนสั้นๆ

```
1. Create GitHub repo
2. git add . && git commit && git push
3. Go to vercel.com → Sign Up with GitHub
4. Import repository from GitHub
5. Set Environment Variables
6. Click Deploy ✅
7. Test on https://thai-iptv-web.vercel.app
8. Every time: git push → auto-deploy!
```

🎉 เสร็จ! ตอนนี้ app ของคุณลอยขึ้นเมฆแล้ว

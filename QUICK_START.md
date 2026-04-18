# Quick Start - Deploy ใน 5 นาที

## วิธีเร็วที่สุด

### 1️⃣ Create GitHub Repository
```
https://github.com/new
→ Repository name: thai-iptv-web
→ Public
→ Create repository
```

### 2️⃣ Push Code
```bash
cd /Users/skycos/Desktop/appcodethaiiptvfree/apigenrb/nextjs-web

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/thai-iptv-web.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy to Vercel
```
1. Go to https://vercel.com
2. Sign Up → Continue with GitHub
3. Import thai-iptv-web repo
4. Keep default settings
5. Click Deploy 🚀
```

### 4️⃣ Set Environment Variables
```
Dashboard → Project → Settings → Environment Variables

DB_HOST = your_host
DB_USER = your_user
DB_PASSWORD = your_pass
DB_NAME = admin_thaiiptvfree
DB_PORT = 3306

NEXT_PUBLIC_API_BASE_URL = https://thai-iptv-web.vercel.app
APP_BASE_URL = https://thai-iptv-web.vercel.app
```

### 5️⃣ Redeploy
```
Click Redeploy on latest deployment
Wait for build to complete ✅
Visit https://thai-iptv-web.vercel.app
```

---

## ที่ต้องระวัง ⚠️

1. **DB_HOST ต้อง accessible จาก Vercel**
   - ถ้าเป็น localhost → ไม่ได้
   - ต้องเป็น IP address สาธารณะ หรือ allow all IPs

2. **กรรมสิทธิ์ GitHub**
   - Vercel ต้อง access GitHub repo
   - ต้อง public repo หรือ private + authenticated

3. **npm install**
   - Vercel จะ run auto → ไม่ต้องทำเอง
   - ถ้า build fail → ดู Logs

---

## Deploy Update (ครั้งต่อไป)

```bash
# Edit files...
git add .
git commit -m "Update something"
git push

# Vercel auto-deploy ใน 30 วินาที!
```

---

## Test Production

```bash
# Homepage
curl https://thai-iptv-web.vercel.app/

# Register API
curl -X POST https://thai-iptv-web.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Pass123","password_confirm":"Pass123"}'
```

---

## ได้ URL: 
```
https://thai-iptv-web.vercel.app/
```

✅ เสร็จ!

---

## ต้องความช่วย?

ดูไฟล์นี้ -> **VERCEL_DEPLOYMENT.md** (คู่มือเต็ม)

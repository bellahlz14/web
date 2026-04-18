# Thai IPTV Web App - Next.js

Next.js web application for Thai IPTV device registration, authentication, and ad management.

## Features

- User registration with 7-day trial
- Username/password login
- QR code-based device pairing
- Subscription management
- Ad completion tracking
- Device session management
- Watch ad page (without login) to earn free time
- Home page with quick navigation

## Prerequisites

- Node.js 18+
- MySQL database
- Environment variables configured

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000

MINUTES_PER_AD=30
QR_SESSION_TTL=300
SUBSCRIPTION_CHECK_INTERVAL=60
```

3. Start development server:
```bash
npm run dev
```

Visit http://localhost:3000

## Database Setup

Create tables with MySQL:

```sql
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE device_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  deviceid VARCHAR(255) NOT NULL,
  device_name VARCHAR(100),
  app_os VARCHAR(50),
  app_version VARCHAR(20),
  linked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active TINYINT(1) DEFAULT 1,
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  UNIQUE KEY unique_device (deviceid)
);

CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  expire_at DATETIME NOT NULL,
  granted_by VARCHAR(50) DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE qr_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(64) UNIQUE NOT NULL,
  account_id INT,
  status ENUM('pending','scanned','confirmed','expired') DEFAULT 'pending',
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ad_watches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  deviceid VARCHAR(255) NOT NULL,
  ad_token VARCHAR(64) NOT NULL,
  minutes_granted INT DEFAULT 30,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/devicestatus` - Check device registration status
- `GET /api/auth/subscriptioncheck` - Check subscription status

### Device Management
- `POST /api/auth/setdevicename` - Set device name
- `POST /api/auth/unlinkdevice` - Unlink device

### QR Code
- `POST /api/qr/create` - Create QR session
- `GET /api/qr/status` - Check QR session status
- `POST /api/qr/confirm` - Confirm QR login

### Ad Completion
- `POST /api/ad/complete` - Complete ad watch

## Deployment to Vercel

1. Push code to GitHub:
```bash
git add .
git commit -m "Add Next.js web app"
git push origin main
```

2. Connect to Vercel:
   - Go to https://vercel.com
   - Create new project from GitHub
   - Select repository

3. Configure environment variables in Vercel dashboard:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`
   - `NEXT_PUBLIC_API_BASE_URL`
   - `APP_BASE_URL`

4. Deploy:
   - Vercel automatically deploys on push to main

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── page.tsx              # Home page with navigation
├── page.module.css       # Home page styles
├── layout.tsx            # Root layout
├── globals.css           # Global styles
├── login/                # Login page
│   ├── page.tsx
│   └── page.module.css
├── register/             # Registration page
│   ├── page.tsx
│   └── page.module.css
├── dashboard/            # User dashboard
│   ├── page.tsx
│   └── page.module.css
├── ad/                   # Ad display page (30s countdown)
│   ├── page.tsx
│   └── page.module.css
├── watch-ad/             # Watch ad entry page (no login required)
│   ├── page.tsx
│   └── page.module.css
├── qr-auth/             # QR authentication page
│   ├── page.tsx
│   └── page.module.css
├── qr-scan/             # QR scan confirmation page
│   ├── page.tsx
│   └── page.module.css
└── api/                 # API routes
    ├── auth/
    │   ├── login/
    │   ├── register/
    │   ├── devicestatus/
    │   ├── subscriptioncheck/
    │   ├── setdevicename/
    │   └── unlinkdevice/
    ├── qr/
    │   ├── create/
    │   ├── status/
    │   └── confirm/
    └── ad/
        └── complete/
lib/
├── db.ts               # Database helpers
├── config.ts           # Configuration
└── validation.ts       # Form validation
```

## License

Proprietary - All rights reserved

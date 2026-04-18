# Next.js Web App - Implementation Summary

## Overview

Complete replacement of PHP backend with Next.js framework for deployment on Vercel. This web application handles user registration, authentication, QR code device pairing, and ad watching system.

## Project Structure

```
apigenrb/nextjs-web/
├── app/
│   ├── layout.tsx              # Root layout with fonts and metadata
│   ├── globals.css             # Global dark theme styles
│   ├── page.tsx                # Home page (redirects to login/dashboard)
│   ├── register/               # Registration page
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── login/                  # Login page
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── dashboard/              # User dashboard
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── ad/                     # Ad display and countdown
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── qr-auth/                # QR code generation for web login
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── qr-scan/                # QR code confirmation page
│   │   ├── page.tsx
│   │   └── page.module.css
│   └── api/                    # API routes
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── devicestatus/route.ts
│       │   ├── subscriptioncheck/route.ts
│       │   ├── setdevicename/route.ts
│       │   └── unlinkdevice/route.ts
│       ├── qr/
│       │   ├── create/route.ts
│       │   ├── status/route.ts
│       │   └── confirm/route.ts
│       └── ad/
│           └── complete/route.ts
├── lib/
│   ├── db.ts                   # Database connection pool and helpers
│   ├── config.ts               # Configuration from environment
│   └── validation.ts           # Form validation utilities
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── vercel.json                 # Vercel deployment config
├── .env.local                  # Environment variables (local)
├── .env.local.example          # Environment template
├── .gitignore                  # Git ignore rules
├── README.md                   # Setup and deployment guide
├── API_TESTING.md              # API endpoint testing guide
└── IMPLEMENTATION_SUMMARY.md   # This file
```

## Key Features Implemented

### 1. User Authentication
- **Registration**: Create account with username, email, password
  - Automatic 7-day trial subscription
  - Optional device linking during registration
  - Password hashing with bcryptjs
  
- **Login**: Username and password authentication
  - Subscription validation (must be active)
  - Optional device linking during login
  - Session stored in browser localStorage

### 2. Device Management
- **Device Linking**: Devices linked to accounts via registration/login or QR code
- **Device Status**: Check if device is registered and subscription status
- **Subscription Check**: Verify subscription is active (used by mobile app every 60s)
- **Device Operations**: Set device name, unlink device

### 3. QR Code System
- **Generate QR**: Create QR session with 5-minute expiration
- **Scan & Confirm**: Web user confirms pairing with mobile device
- **Status Polling**: Mobile app polls for confirmation status

### 4. Ad Watching System
- **Ad Display**: Show 30-second countdown timer
- **Auto-completion**: Automatically complete after countdown
- **Subscription Grant**: Add 30 minutes to subscription upon completion
- **Device Tracking**: Record which device watched the ad

### 5. Security Features
- Bcryptjs password hashing (rounds: 10)
- SQL parameter binding (prepared statements)
- Subscription expiration validation
- Device session tracking with last_seen_at
- Token-based QR sessions

## Technology Stack

- **Framework**: Next.js 14.0.0 with App Router
- **Frontend**: React 18.2.0
- **Language**: TypeScript 5.0.0
- **Database**: MySQL with mysql2/promise
- **Authentication**: bcryptjs for password hashing
- **QR Code**: qrcode.react 3.1.0
- **Styling**: CSS Modules with global dark theme
- **Deployment**: Vercel

## Database Schema

### accounts
```sql
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### device_sessions
```sql
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
```

### subscriptions
```sql
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  expire_at DATETIME NOT NULL,
  granted_by VARCHAR(50) DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
```

### qr_sessions
```sql
CREATE TABLE qr_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(64) UNIQUE NOT NULL,
  account_id INT,
  status ENUM('pending','scanned','confirmed','expired') DEFAULT 'pending',
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### ad_watches
```sql
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

### Authentication (6 endpoints)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user
- `GET /api/auth/devicestatus` - Check device status
- `GET /api/auth/subscriptioncheck` - Check subscription
- `POST /api/auth/setdevicename` - Set device name
- `POST /api/auth/unlinkdevice` - Unlink device

### QR Code (3 endpoints)
- `POST /api/qr/create` - Create QR session
- `GET /api/qr/status` - Check session status
- `POST /api/qr/confirm` - Confirm QR login

### Ad System (1 endpoint)
- `POST /api/ad/complete` - Complete ad watch

**Total: 10 API endpoints**

## Environment Variables

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=admin_thaiiptvfree
DB_PORT=3306

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000

MINUTES_PER_AD=30
QR_SESSION_TTL=300
SUBSCRIPTION_CHECK_INTERVAL=60
```

## User Flows

### Web Registration Flow
1. Visit `/register`
2. Fill form (username, email, password)
3. Submit → Backend creates account with 7-day trial
4. Success message appears
5. User logs in at `/login`
6. Redirected to `/dashboard`

### Web Device Pairing Flow
1. Login at `/login`
2. Go to `/qr-auth`
3. Generate QR code with unique token
4. Mobile app scans QR → `/qr-scan?token=X`
5. User confirms on web
6. Mobile app polls `/api/qr/status` and sees confirmed
7. Device is linked to account

### Ad Watching Flow
1. Mobile app detects expired subscription
2. Shows QR code: `/ad?deviceid=X&token=Y`
3. User scans on web browser
4. 30-second countdown displays
5. Auto-completes → POST `/api/ad/complete`
6. Backend grants 30 minutes
7. Mobile app checks `/api/auth/subscriptioncheck` and sees active

### Mobile App Direct Flow
1. Mobile app calls `POST /api/auth/register` with deviceid
2. Backend creates account + device_sessions
3. Mobile app logs in with `POST /api/auth/login`
4. Device session updated with last_seen_at
5. Mobile app stores credentials locally
6. Every 60s: calls `GET /api/auth/subscriptioncheck`
7. On expiry: shows ad QR code

## Performance Considerations

- **Database Connection Pool**: 10 connections, configured in db.ts
- **QR Code TTL**: 5 minutes (300 seconds)
- **Subscription Check**: Mobile app checks every 60 seconds
- **QR Polling**: Mobile app polls every 3 seconds during QR auth
- **CSS Modules**: Component-scoped styling prevents conflicts
- **Dynamic Imports**: QRCode component loaded dynamically (no SSR)

## Security Considerations

- Bcryptjs hashing with 10 rounds (standard security)
- SQL parameter binding prevents injection
- Token-based QR sessions (64-char hex tokens)
- Device-to-account mapping prevents unauthorized access
- Subscription expiration validation on every login
- Server time sent with responses to prevent clock manipulation

## Deployment to Vercel

1. Push repository to GitHub
2. Connect to Vercel via dashboard
3. Add environment variables in Vercel project settings
4. Deploy (automatic on push to main)

Production URL: `https://your-domain.vercel.app`

## Testing

See `API_TESTING.md` for:
- Complete cURL examples for all endpoints
- Web flow testing steps
- Error cases and responses
- Production deployment checklist

## Migration from PHP

This Next.js app replaces the following PHP files:
- `apigenrb/php/register.php` → `POST /api/auth/register`
- `apigenrb/php/login.php` → `POST /api/auth/login`
- `apigenrb/php/qr-auth.php` → `GET /qr-auth` (page) + `POST /api/qr/create`
- `apigenrb/php/qr-auth-verify.php` → `POST /api/qr/confirm`
- `apigenrb/php/ad.php` → `GET /ad` (page)
- `apigenrb/php/ad-complete.php` → `POST /api/ad/complete`

The mobile app API routes remain compatible - no changes needed to mobile app code.

## Troubleshooting

### Database Connection Issues
- Verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- Check firewall allows MySQL port (3306)
- Test connection with: `npm run dev`

### QR Code Not Rendering
- Verify qrcode.react is installed: `npm install`
- Check browser console for errors
- Ensure JavaScript is enabled

### Ad Page Not Closing
- Add manual close button if needed
- Check deviceid and token are passed in URL
- Verify ad_watches table exists in database

## Future Improvements

1. **Rate Limiting**: Implement per-IP rate limiting for API endpoints
2. **Email Verification**: Send verification email after registration
3. **Password Reset**: Add password recovery flow
4. **Account Management**: Allow users to change password, email
5. **Analytics**: Track ad watches, subscription grants
6. **Webhooks**: Notify external systems of subscription changes
7. **Multi-language**: Support multiple language interfaces
8. **Admin Dashboard**: Manage users, subscriptions, ads

## Support

For API endpoint details, see `API_TESTING.md`
For setup instructions, see `README.md`
For issues, check browser console logs and server logs in Vercel dashboard

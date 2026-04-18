# Pages & Routes Guide

## Public Pages (No Login Required)

### Home Page `/`
- **Purpose**: Landing page with navigation
- **Features**:
  - Quick links to Login, Register, Watch Ad
  - Info about service features
  - Responsive design
- **Links to**:
  - Login (`/login`)
  - Register (`/register`)
  - Watch Ad (`/watch-ad`)

### Watch Ad Page `/watch-ad`
- **Purpose**: Watch advertisements to earn free time
- **Features**:
  - Input Device ID
  - Embed 30-second ad timer
  - Demo mode available
- **User Flow**:
  1. User enters Device ID (optional, can use demo)
  2. Click "ดูโฆษณา" button
  3. Ad page loads in iframe
  4. 30-second countdown displays
  5. Auto-completes and grants 30 minutes
- **Demo Link**: `/watch-ad` → click "ทดลองดู" button
- **Links to**:
  - Login (`/login`)
  - Register (`/register`)

### Login Page `/login`
- **Purpose**: User authentication
- **Features**:
  - Username/password form
  - Session storage in localStorage
  - Error messaging
  - Link to register
- **Form Fields**:
  - Username (text)
  - Password (password)
- **On Success**: Redirects to `/dashboard`
- **On Error**: Shows error message, user can retry
- **Links to**:
  - Register (`/register`)
  - Dashboard (`/dashboard`)

### Register Page `/register`
- **Purpose**: Create new account
- **Features**:
  - Account creation with validation
  - Automatic 7-day trial subscription
  - Password confirmation
  - Success screen
- **Form Fields**:
  - Username (min 3 chars, max 50)
  - Email (valid email format)
  - Password (min 6 chars)
  - Confirm Password (must match)
- **Validations**:
  - Username uniqueness
  - Email format
  - Password strength (6+ chars)
  - Password match
- **On Success**: Shows success message, prompts to login
- **Links to**:
  - Login (`/login`)

### Ad Display Page `/ad`
- **Purpose**: Show advertisement with countdown timer
- **Parameters**:
  - `deviceid` (required) - Device identifier
  - `token` (required) - Ad token from mobile app
- **Features**:
  - 30-second countdown
  - Auto-completion
  - Success message with time granted
  - Error handling
- **Flow**:
  1. Page loads with timer at 30 seconds
  2. Timer counts down every second
  3. At 0 seconds, auto-completes ad
  4. Calls `POST /api/ad/complete`
  5. Shows success message
  6. Grants 30 minutes to account
- **Usage**: 
  - Called from `/watch-ad` page
  - Called from mobile app (ExpiryScreen shows QR)
- **Response Shows**:
  - Minutes granted
  - New expiration date

### QR Authentication Page `/qr-auth`
- **Purpose**: Generate QR code for device pairing via web
- **Features**:
  - Auto-generates QR session
  - Displays QR code
  - Polls for device confirmation
  - Auto-redirects on success
- **Flow**:
  1. User visits page
  2. Backend generates QR token (5-min TTL)
  3. QR code displayed
  4. Mobile app scans QR
  5. Page polls `/api/qr/status` every 3s
  6. When confirmed, shows success
  7. Redirects to `/dashboard` after 2s
- **Use Case**: 
  - Mobile app wants to login via web QR
  - Alternative to username/password

### QR Scan Confirmation Page `/qr-scan?token=xxx`
- **Purpose**: Confirm QR code scan from logged-in web user
- **Parameters**:
  - `token` (required) - QR session token
- **Features**:
  - Shows logged-in username
  - Confirm button to link device
  - Error handling for expired tokens
- **Flow**:
  1. Mobile app scans QR → opens this page
  2. User is already logged in on web
  3. Shows username to confirm
  4. Clicks "ยืนยัน" button
  5. Calls `POST /api/qr/confirm`
  6. Device is linked to account
  7. Mobile app detects confirmation via polling
  8. Mobile app advances to next screen
- **Use Case**: Web user confirms linking mobile device

---

## Protected Pages (Login Required)

### Dashboard Page `/dashboard`
- **Purpose**: User profile and account information
- **Features**:
  - Display username
  - Display subscription expiry date
  - Show days remaining
  - Logout button
- **Data Sources**:
  - localStorage: user object (account_id, username, expire_at)
- **User Info Shown**:
  - Username
  - Account ID
  - Expiration date
  - Days remaining (if active)
- **Actions**:
  - Logout → clears localStorage → redirects to `/login`
- **Auto-redirect**: If user not logged in, shows error

---

## API Routes (Server-Side)

### `/api/auth/register` - POST
- Creates account with 7-day trial
- Optional device linking
- Returns account_id, username, expire_at

### `/api/auth/login` - POST
- Validates credentials
- Checks subscription
- Optional device linking
- Returns account_id, username, expire_at

### `/api/auth/devicestatus` - GET
- Check if device is registered
- Returns registered status, account info

### `/api/auth/subscriptioncheck` - GET
- Check if subscription is active
- Returns active status, expiry date

### `/api/auth/setdevicename` - POST
- Update device friendly name

### `/api/auth/unlinkdevice` - POST
- Deactivate device session

### `/api/qr/create` - POST
- Generate new QR session
- Returns token and expiration

### `/api/qr/status` - GET
- Check QR session confirmation status
- Returns status, account_id, expire_at

### `/api/qr/confirm` - POST
- Confirm QR login from web
- Links device to account

### `/api/ad/complete` - POST
- Complete ad watch
- Grants subscription time
- Returns new expiration

---

## Navigation Flow Chart

```
                    ┌─────────────┐
                    │   Home (/)  │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            v              v              v
        ┌──────┐      ┌──────┐      ┌────────────┐
        │Login │     │Register   │Watch Ad     │
        └──┬───┘      └──┬──┘      └─┬────┬───┘
           │              │          │    │
           └──────────┬───┘          │    │ Demo
                      v              v    v
                   ┌─────────────────────┐
                   │ Dashboard /         │
                   │ (if logged in)      │
                   └─────────────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
                    v                v
                 QR Auth          Logout
                (if paired)        (→ Login)
```

---

## Data Flow

### Registration Flow
```
1. User visits /register
2. Fills form (username, email, password)
3. Submits → POST /api/auth/register
4. Backend: creates account, grants 7-day trial
5. Success screen shown
6. User goes to /login with new credentials
```

### Login Flow
```
1. User visits /login
2. Enters username, password
3. Submits → POST /api/auth/login
4. Backend: validates credentials, checks subscription
5. Returns account_id, username, expire_at
6. Frontend: stores in localStorage
7. Redirects to /dashboard
```

### Ad Watching Flow
```
1. User visits /watch-ad
2. Enters device ID (or uses demo)
3. Clicks "ดูโฆษณา"
4. /ad page loads with 30-second timer
5. Timer counts down
6. At 0s, POST /api/ad/complete called
7. Backend grants 30 minutes
8. Success message shown
9. User clicks Back to try again
```

### QR Device Pairing Flow
```
1. Logged-in user visits /qr-auth
2. Backend creates QR token
3. Frontend displays QR code
4. Mobile app scans QR
5. Opens /qr-scan?token=xxx
6. User clicks "ยืนยัน"
7. POST /api/qr/confirm called
8. Device linked to account
9. Mobile app polling detects confirmation
10. Mobile app advances
```

---

## Environment-Specific Behavior

### Development (`npm run dev`)
- Runs on http://localhost:3000
- Database: local or dev server
- All pages accessible
- Hot reload enabled

### Production (Vercel)
- Runs on https://your-domain.vercel.app
- Database: production MySQL
- HTTPS enforced
- Environment variables from Vercel dashboard

---

## Testing URLs

```
# Public pages
http://localhost:3000/              # Home
http://localhost:3000/register      # Register
http://localhost:3000/login         # Login
http://localhost:3000/watch-ad      # Watch Ad

# Ad pages (with required params)
http://localhost:3000/ad?deviceid=test&token=test123
http://localhost:3000/ad?deviceid=demo&token=demo

# QR pages
http://localhost:3000/qr-auth       # Generate QR
http://localhost:3000/qr-scan?token=abc123def456

# Protected (requires login)
http://localhost:3000/dashboard     # User dashboard
```

---

## Browser Storage

The application uses `localStorage` to store user sessions:

```javascript
// After successful login
localStorage.setItem('user', JSON.stringify({
  account_id: 1,
  username: "john_doe",
  expire_at: "2026-04-25T07:00:00.000Z"
}));

// To clear (logout)
localStorage.removeItem('user');
```

---

## SSL/HTTPS

All pages use HTTPS in production. In development, use HTTP with localhost.

Vercel automatically provides SSL certificates for all deployments.

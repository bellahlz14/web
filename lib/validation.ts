export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'ชื่อผู้ใช้ไม่ควรว่างเปล่า' };
  }
  if (username.length < 3) {
    return { valid: false, error: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร' };
  }
  if (username.length > 50) {
    return { valid: false, error: 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร' };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'รหัสผ่านไม่ควรว่างเปล่า' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
  }
  return { valid: true };
}

export function validatePasswordMatch(password: string, confirm: string): boolean {
  return password === confirm;
}

export function validateDeviceId(deviceId: string): boolean {
  return deviceId && deviceId.length > 0;
}

export function validateToken(token: string): boolean {
  return token && token.length >= 32;
}

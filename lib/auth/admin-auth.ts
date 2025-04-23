import { createHash } from 'crypto';

const ADMIN_EMAIL = 'ritmoalpha.0@gmail.com';
const ADMIN_PASSWORD_HASH = createHash('sha256').update('Ritmoalpha01.').digest('hex');

export function verifyAdminCredentials(email: string, password: string): boolean {
  const passwordHash = createHash('sha256').update(password).digest('hex');
  return email === ADMIN_EMAIL && passwordHash === ADMIN_PASSWORD_HASH;
}

export function isAdminSession(session: any): boolean {
  return session?.user?.email === ADMIN_EMAIL;
} 
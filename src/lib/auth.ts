import bcrypt from 'bcryptjs';

export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return password === adminPassword; // Simple comparison for now
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('authenticated') === 'true';
  }
  return false;
}

export function setAuthenticated(value: boolean): void {
  if (typeof window !== 'undefined') {
    if (value) {
      sessionStorage.setItem('authenticated', 'true');
    } else {
      sessionStorage.removeItem('authenticated');
    }
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('authenticated');
    window.location.href = '/';
  }
}
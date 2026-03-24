import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS, PASSWORD_MIN_LENGTH } from "./constants";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`รหัสผ่านต้องมีอย่างน้อย ${PASSWORD_MIN_LENGTH} ตัวอักษร`);
  }
  if (!/[A-Za-z]/.test(password)) {
    errors.push("รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษ");
  }
  if (!/\d/.test(password)) {
    errors.push("รหัสผ่านต้องมีตัวเลข");
  }

  return { valid: errors.length === 0, errors };
}

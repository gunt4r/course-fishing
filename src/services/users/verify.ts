import type { JwtPayload } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';

export type TokenPayload = {
  id: string;
  email: string;
  role: string;
} & JwtPayload;

export function verifyJWT(token: string): TokenPayload | null {
  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export function isAdminToken(token: string): boolean {
  const payload = verifyJWT(token);
  return payload?.role === 'admin';
}

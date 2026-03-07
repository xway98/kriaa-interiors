// lib/auth.ts — JWT admin authentication helpers
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const COOKIE_NAME = 'kriaa_admin_token';

export function signAdminToken(): string {
    return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyAdminToken(token: string): boolean {
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}

export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifyAdminToken(token);
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;

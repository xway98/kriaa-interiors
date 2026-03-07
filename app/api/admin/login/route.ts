// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, COOKIE_NAME_EXPORT } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const token = signAdminToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME_EXPORT, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
    });

    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(COOKIE_NAME_EXPORT);
    return response;
}

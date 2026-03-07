// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !phone) {
            return NextResponse.json({ error: 'Name, email and phone are required.' }, { status: 400 });
        }

        const db = getAdminDb();
        const docRef = await db.collection('leads').add({
            name, email, phone,
            message: message || '',
            contacted: false,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
    } catch (err) {
        console.error('Error saving lead:', err);
        return NextResponse.json({ error: 'Failed to save enquiry.' }, { status: 500 });
    }
}

export async function GET() {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const db = getAdminDb();
        const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
        const leads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(leads);
    } catch (err) {
        console.error('Error fetching leads:', err);
        return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
    }
}

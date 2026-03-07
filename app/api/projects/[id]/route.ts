// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminStorage } from '@/lib/firebase-admin';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        const db = getAdminDb();
        const storage = getAdminStorage();
        const doc = await db.collection('projects').doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            if (data?.filename) {
                try { await storage.bucket().file(data.filename).delete(); } catch { /* file might be gone */ }
            }
            await db.collection('projects').doc(id).delete();
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error deleting project:', err);
        return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
    }
}

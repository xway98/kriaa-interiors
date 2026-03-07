// app/api/projects/[id]/route.ts — delete a project
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import { isAdminAuthenticated } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        const doc = await adminDb.collection('projects').doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            if (data?.filename) {
                try {
                    await adminStorage.bucket().file(data.filename).delete();
                } catch (_) {
                    // file might already be gone
                }
            }
            await adminDb.collection('projects').doc(id).delete();
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error deleting project:', err);
        return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
    }
}

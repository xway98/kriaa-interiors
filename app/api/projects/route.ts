// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminStorage } from '@/lib/firebase-admin';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = getAdminDb();
        const snapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
        const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(req: NextRequest) {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get('image') as File;
        const title = formData.get('title') as string;
        const location = formData.get('location') as string;
        const category = formData.get('category') as string;

        if (!file || !title) {
            return NextResponse.json({ error: 'Image and title are required.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `projects/${Date.now()}_${file.name.replace(/\s/g, '_')}`;

        const storage = getAdminStorage();
        const bucket = storage.bucket();
        const fileRef = bucket.file(filename);
        await fileRef.save(buffer, { contentType: file.type, public: true });

        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        const db = getAdminDb();
        const docRef = await db.collection('projects').add({
            title,
            location: location || '',
            category: category || 'Residential',
            imageUrl,
            filename,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, id: docRef.id, imageUrl }, { status: 201 });
    } catch (err) {
        console.error('Error uploading project:', err);
        return NextResponse.json({ error: 'Failed to upload project.' }, { status: 500 });
    }
}

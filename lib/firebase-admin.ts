// lib/firebase-admin.ts — SERVER-SIDE Firebase Admin SDK (lazy init)
import * as admin from 'firebase-admin';

function getApp(): admin.app.App {
    if (admin.apps.length) return admin.apps[0]!;

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase Admin credentials not configured. Set FIREBASE_ADMIN_* env vars.');
    }

    return admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
}

export function getAdminDb() {
    getApp();
    return admin.firestore();
}

export function getAdminStorage() {
    getApp();
    return admin.storage();
}

export default admin;

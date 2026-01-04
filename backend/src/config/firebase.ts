import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    if (admin.apps.length === 0) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
            console.warn('⚠️ Firebase Admin SDK not configured. Some features may not work.');
            return null;
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });

        console.log('✅ Firebase Admin SDK initialized');
    }

    return admin;
};

export const firebaseAdmin = initializeFirebase();
export const db = firebaseAdmin ? admin.firestore() : null;
export const auth = firebaseAdmin ? admin.auth() : null;

export default admin;

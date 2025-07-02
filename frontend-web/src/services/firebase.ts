import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getToken } from "firebase/messaging";

const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Export messaging (for FCM)
export const messaging = getMessaging(firebaseApp);

export async function getFCMToken(): Promise<string | null> {
    try {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        return token;
    } catch (err) {
        console.error("FCM token error:", err);
        return null;
    }
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

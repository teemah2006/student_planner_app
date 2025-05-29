import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
// import serviceAccount from "./serviceAccount.json";

if (!getApps().length) {
  const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64!, 'base64').toString()
);
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
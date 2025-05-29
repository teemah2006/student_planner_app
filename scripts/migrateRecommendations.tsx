// migrateRecommendations.ts
import {  adminDb } from "../utils/firebaseAdmin";
// import { db } from "../utils/firebase";
import { collection, query, where, getDocs,  writeBatch } from "firebase/firestore";
 export async function migrateUserRecommendations(user: { email: unknown; uid: any; }) {
  if (!user?.email || !user?.uid) return;

  const recommendationsRef = adminDb.collection("recommendations");

    // 1. Check if user already has migrated docs with uid
    const uidSnapshot = await recommendationsRef.where("uid", "==", user.uid).get();

  if (!uidSnapshot.empty) {
    // User already has migrated docs with uid, no need to migrate
    return;
  }

   const emailSnapshot = await recommendationsRef.where("email", "==", user.email).get();
    if (emailSnapshot.empty) {
      return; // Nothing to migrate
    }

    // 3. Add uid field to each legacy doc
    const batch = adminDb.batch();
    emailSnapshot.forEach((doc) => {
      batch.update(doc.ref, { uid: user.uid });
    });

  await batch.commit();
  console.log(`Migrated ${emailSnapshot.size} documents for user ${user.email}`);
}

 export async function rearrangeUserRecommendations(user: { email: unknown; uid: any; }) {
  // console.log('uid', user.uid)
  try {
    // Check if migration already done by querying new location
    const userRecRef = adminDb.collection('users').doc(user.uid).collection('recommendations');
    const existingDocs = await userRecRef.limit(1).get();
    if (!existingDocs.empty) {
      console.log(`User ${user.uid} already migrated.`);
      return; // Migration already done
    }

    

    // Get all docs from old collection with matching uid
    const oldRecsRef = adminDb.collection('recommendations');
    const snapshot = await oldRecsRef.where('uid', '==', user.uid).get();

    if (snapshot.empty) {
      console.log(`No old recommendations found for user ${user.uid}`);
      return;
    }

    // Copy documents
    const batch = adminDb.batch();
    snapshot.forEach(doc => {
      const newDocRef = userRecRef.doc(doc.id);
      batch.set(newDocRef, doc.data());
      // Optional: delete old doc
      // batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Migration completed for user ${user.uid}`);
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// export default migrateUserRecommendations
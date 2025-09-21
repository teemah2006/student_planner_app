'use client';

import { useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import {migrateUserRecommendations , rearrangeUserRecommendations} from '../../../scripts/migrateRecommendations';

const AuthSync = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const syncFirebaseAuth = async () => {
      const auth = getAuth();
      const session = await getSession();

      if (
        session &&
        session.user &&
        session.user.email &&
        session.idToken
      ) {
        const credential = GoogleAuthProvider.credential(session.idToken);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          console.log('✅ Firebase user signed in.');


          // Call migration function here, passing the Firebase user object
          
          


          const firebaseIdToken = await userCredential.user.getIdToken();

          // ✅ Send token to API or store for requests
          localStorage.setItem('firebaseToken', firebaseIdToken); // Optional
          console.log('📦 Stored Firebase token');

          await fetch('/api/migrate-user', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${firebaseIdToken}`,
            },
          });

          // Or optionally call your API immediately
          // await fetch('/api/some-protected-route', {
          //   headers: {
          //     Authorization: `Bearer ${firebaseIdToken}`,
          //   },
          // });
        } catch (err) {
          console.error('❌ Firebase sign-in error:', err);
        }
      }
    };

    syncFirebaseAuth();
  }, [session]);

  return null;
};

export default AuthSync;

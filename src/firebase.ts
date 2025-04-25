import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getEnv } from './services/env';

const envVar = getEnv();



if (!envVar) {
  throw new Error("Environment variables are not set correctly.");
}



const firebaseConfig = {
  // Copia qui le tue credenziali dalla Firebase Console
  // Project Settings -> General -> Your apps -> Web app (</>)
    apiKey: envVar?.apiKey,
    authDomain: envVar?.authDomain,
    projectId: envVar?.projectId,
    storageBucket: envVar?.storageBucket,
    messagingSenderId: envVar?.messagingSenderId,
    appId: envVar?.appId,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
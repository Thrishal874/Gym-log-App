import { initializeApp, FirebaseApp } from 'firebase/app';
import {
    initializeAuth,
    Auth,
    getAuth,
    browserLocalPersistence,
    browserSessionPersistence,
    inMemoryPersistence
} from 'firebase/auth';
// @ts-ignore - getReactNativePersistence exists in react-native bundle
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

// const firebaseConfig: FirebaseConfig = {
//     apiKey: "AIzaSyDDyKDBnMv4wKhHyPz_TVMYzmBYCmbEPV4",
//     authDomain: "task-manager-8a48b.firebaseapp.com",
//     projectId: "task-manager-8a48b",
//     storageBucket: "task-manager-8a48b.firebasestorage.app",
//     messagingSenderId: "69382403000",
//     appId: "1:69382403000:web:db09c4aa8645d9919d954d"
// };

const firebaseConfig = {
  apiKey: "AIzaSyC05ivoNsWWa_vpq3_Uwf9hd4f6KVyveAI",
  authDomain: "gym-app-4b0eb.firebaseapp.com",
  projectId: "gym-app-4b0eb",
  storageBucket: "gym-app-4b0eb.firebasestorage.app",
  messagingSenderId: "327093060979",
  appId: "1:327093060979:web:0476a763f67fc439b1f106"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize auth with persistence for React Native
let auth: Auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (error: any) {
    // Auth already initialized, get the existing instance
    if (error.code === 'auth/already-initialized') {
        auth = getAuth(app);
    } else {
        throw error;
    }
}

export { auth };
export const db: Firestore = getFirestore(app);

export default app;

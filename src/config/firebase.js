import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpKytFXiMXhEthv0WP18l0B0IvydnVSoc",
    authDomain: "tsp-game-app.firebaseapp.com",
    projectId: "tsp-game-app",
    storageBucket: "tsp-game-app.firebasestorage.app",
    messagingSenderId: "1019269941116",
    appId: "1:1019269941116:web:9017badf8f6ae29b1906f9",
    measurementId: "G-1B8DYP07QS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support offline persistence');
    }
});

export default app;

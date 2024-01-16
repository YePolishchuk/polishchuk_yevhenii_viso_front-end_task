import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyDbmQzRljiONBb5AhbyqO2V7woJ1AgBHjs",
  authDomain: "viso-task.firebaseapp.com",
  projectId: "viso-task",
  storageBucket: "viso-task.appspot.com",
  messagingSenderId: "339948300392",
  appId: "1:339948300392:web:aa7f5dd8f5ef429a8f33dd",
  measurementId: "G-EN828PZ8PC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyAObn5eK4ZOq-KiI11TYRxfMf8a6MmSsvg",
  authDomain: "viso-front-end-task-230e8.firebaseapp.com",
  projectId: "viso-front-end-task-230e8",
  storageBucket: "viso-front-end-task-230e8.appspot.com",
  messagingSenderId: "512754960243",
  appId: "1:512754960243:web:ec7640c4a854166e296706",
  measurementId: "G-DJ9D79EE1N"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
import { collection, getDocs, query } from "firebase/firestore/lite";
import { db } from "./Components/Firebase/Firebase";

export const fetchMarkersFromFirestore = async () => {
  try {
    const markersCollection = collection(db, 'markers');

    const q = query(markersCollection);

    const querySnapshot = await getDocs(q);

    const markersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Markers from Firestore:', markersData);

  } catch (error) {
    console.error('Error fetching markers from Firestore:', error);
  }
};
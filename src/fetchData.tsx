import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "./Components/Firebase/Firebase";

export const fetchMarkersFromFirestore = async () => {
  const markersCollection = collection(db, 'markers');

  try {
    const querySnapshot = await getDocs(markersCollection);

    const markersData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: parseInt(doc.id, 10),
        lat: data.location.lat,
        lng: data.location.lng,
      };
    });

    return markersData;
  } catch (error) {
    console.error('Error fetching markers:', error);
    return [];
  }
};
import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import './Map.scss';
import { db } from '../Firebase/Firebase';
import { Timestamp, deleteDoc, doc, setDoc } from 'firebase/firestore/lite';
import { fetchMarkersFromFirestore } from '../../fetchData';

interface Markers {
  id: number
  lat: number,
  lng: number,
}

const API_KEY = 'AIzaSyAS6ELTij1YwpoIXa-ZW23lBK1_RlGwaSw';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 50.45056350883063,
  lng: 30.52302564499541,
};

export const Map: React.FC = () => {
  const [markers, setMarkers] = useState<Markers[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch markers from Firestore when the component mounts
    fetchMarkersFromFirestore().then((fetchedMarkers) => {
      console.log(fetchedMarkers);
      //@ts-ignore
      setMarkers(fetchedMarkers);
    });
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });


  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const onMapClick = async (event: google.maps.MapMouseEvent) => {
    const newMarker = {
      id: Date.now(),
      //@ts-ignore
      lat: event.latLng.lat(),
      //@ts-ignore
      lng: event.latLng.lng(),
    };

    try {
      const markerDocRef = doc(db, 'markers', newMarker.id.toString());
      await setDoc(markerDocRef, {
        location: newMarker,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding marker: ', error);
    }

    setMarkers((previous) => [
      ...previous, newMarker
    ]);
  };

  const onMarkerDragEnd = async (id: number, event: google.maps.MapMouseEvent) => {
    const newMarkers = await markers.map((marker) =>
      marker.id === id
        //@ts-ignore
        ? { ...marker, lat: event.latLng.lat(), lng: event.latLng.lng() }
        : marker
    );
    setMarkers(newMarkers);
  };

  const handleDeleteMarker = async (id: number) => {
    try {
      const markerDocRef = doc(db, 'markers', id.toString());
      await deleteDoc(markerDocRef);
  
      const updatedMarkers = markers.filter((marker) => marker.id !== id);
      setMarkers(updatedMarkers);
      setSelectedMarkerId(null);
    } catch(error) { 
      console.error('Error deleting marker: ', error);
    }
    
  };

  const handleDeleteAllMarkers = async () => {
    try {
      // Delete all marker documents from Firestore
      const batch: any[] = [];
      markers.forEach((marker) => {
        const markerDocRef = doc(db, 'markers', marker.id.toString());
        console.log(markerDocRef)
        batch.push(deleteDoc(markerDocRef));
      });
      await Promise.all(batch);
  
      // Update the local state to remove all markers
      setMarkers([]);
      setSelectedMarkerId(null);
    } catch (error) {
      console.error('Error deleting all markers: ', error);
    }
  };

  return (
    <div className="container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        onClick={onMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker}
            draggable={true}
            onDragEnd={(event) => onMarkerDragEnd(marker.id, event)}
            onClick={() => (
              !selectedMarkerId ? (
                setSelectedMarkerId(marker.id)
              ) : (
                setSelectedMarkerId(null)
              )
            )}
            icon={
              selectedMarkerId === marker.id
                ? { url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }
                : undefined
            }
          />
        ))}

        {selectedMarkerId && markers.length ? (
          <div style={{ position: 'absolute', top: 10, right: 60 }}>
            <button onClick={() => handleDeleteMarker(selectedMarkerId)}>Delete Marker</button>
          </div>
        )
          : (
            <div style={{ position: 'absolute', top: 10, right: 60, background: '#555' }}>
              <button disabled={!selectedMarkerId || !markers.length}>Delete Marker</button>
            </div>
          )
        }

        <div style={{ position: 'absolute', top: 10, right: 170, background: '#555' }}>
          <button
            onClick={handleDeleteAllMarkers}
            disabled={!markers.length}
          >
            Delete All Markers
          </button>
        </div>
      </GoogleMap>
    </div>
  )
}
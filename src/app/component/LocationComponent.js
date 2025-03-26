"use client";
import { useState } from "react";
import { db, collection, addDoc } from "../lib/firebase";

export default function LocationComponent() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          // Store location in Firestore
          await addDoc(collection(db, "userLocations"), {
            latitude,
            longitude,
            timestamp: new Date(),
          });

          console.log("Location saved to Firebase!");
        } catch (err) {
          console.error("Error storing location:", err);
          setError("Failed to store location");
        }
      },
      (err) => {
        setError(err.message);
      }
    );
  };

  return (
    <div>
      <button onClick={getLocation}>Get Location</button>
      {location && <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

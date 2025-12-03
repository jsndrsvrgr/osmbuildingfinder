/**
 * Hook for user location tracking
 */
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setPermissionGranted(false);
          return;
        }

        setPermissionGranted(true);

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation(currentLocation);

        // Watch location updates
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,  // Update every 5 seconds
            distanceInterval: 10,  // Or when moved 10 meters
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );

        return () => {
          subscription.remove();
        };
      } catch (error) {
        setErrorMsg('Error getting location: ' + error.message);
      }
    })();
  }, []);

  return {
    location,
    errorMsg,
    permissionGranted,
    latitude: location?.coords?.latitude,
    longitude: location?.coords?.longitude,
  };
};

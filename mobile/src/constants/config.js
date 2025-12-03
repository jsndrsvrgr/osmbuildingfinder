/**
 * App configuration
 */

// API Configuration
export const API_CONFIG = {
  // For iOS Simulator: use localhost
  // For Android Emulator: use 10.0.2.2
  // For physical device: use your computer's IP address
  BASE_URL: __DEV__
    ? 'http://localhost:8080/api'  // Development - Your computer's IP
    : 'https://your-app.fly.dev/api',  // Production (update after deployment)
};

// Northwestern University campus center coordinates
export const NU_CAMPUS_CENTER = {
  latitude: 42.0558,
  latitudeDelta: 0.02,
  longitude: -87.6751,
  longitudeDelta: 0.02,
};

// Map style
export const MAP_STYLE = [];  // Can add custom map styling here

// Update interval for live buses (milliseconds)
export const BUS_UPDATE_INTERVAL = 10000;  // 10 seconds

# Northwestern Bus Finder - Mobile App

React Native mobile application for tracking buildings and CTA buses at Northwestern University.

## Features

- 🗺️ Interactive map of Northwestern campus
- 🏢 103+ campus buildings with addresses
- 🚌 Live CTA bus tracking
- 📍 User location tracking
- 🔄 Real-time bus position updates (every 10 seconds)
- 🎯 Toggle buildings and buses display

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your phone (for testing)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Installation

```bash
# Install dependencies
npm install
```

## Running the App

### Method 1: Expo Go (Recommended for Testing)

1. **Start the backend API** (in a separate terminal):
   ```bash
   cd ../  # Go to project root
   source venv/bin/activate
   cd api
   python main.py
   ```

2. **Start Expo**:
   ```bash
   npx expo start
   ```

3. **Open on your device**:
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - The app will load on your phone

### Method 2: iOS Simulator (macOS only)

```bash
npx expo start --ios
```

### Method 3: Android Emulator

```bash
npx expo start --android
```

## Configuration

### API Connection

The app connects to the backend API based on the environment:

- **Development** (default): `http://localhost:8080/api`
  - For iOS Simulator: works as-is
  - For Android Emulator: automatically uses `10.0.2.2`
  - For physical device: update `src/constants/config.js` with your computer's IP

- **Production**: Set after deploying to Fly.io

To use with a physical device on the same network:

1. Find your computer's IP address:
   - macOS: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig`

2. Update `src/constants/config.js`:
   ```javascript
   BASE_URL: __DEV__
     ? 'http://YOUR_IP_ADDRESS:8080/api'
     : 'https://your-app.fly.dev/api',
   ```

## App Structure

```
mobile/
├── App.js                          # Main app entry
├── src/
│   ├── constants/
│   │   └── config.js              # API URLs and map config
│   ├── services/
│   │   └── api.js                 # API client (axios)
│   ├── hooks/
│   │   ├── useLocation.js         # User location tracking
│   │   ├── useBuildings.js        # Fetch buildings data
│   │   └── useLiveBuses.js        # Live bus updates
│   ├── components/
│   │   ├── BuildingMarker.js      # Building map markers
│   │   └── BusMarker.js           # Live bus markers
│   └── screens/
│       └── MapScreen.js           # Main map view
```

## Troubleshooting

### Location Permission Issues

- **iOS**: Location permission dialog should appear automatically
- **Android**: Grant location permission when prompted

### Can't connect to API

- Ensure backend server is running (`python api/main.py`)
- Check that you're using the correct IP address for physical devices
- Verify firewall isn't blocking port 8080

### Maps not showing

- For Android: Add your Google Maps API key to `app.json`
- For iOS: Maps should work out of the box

### Live buses not updating

- Check your internet connection
- Verify CTA API key is configured in backend
- Look at backend logs for API errors

## Building for Production

### iOS

```bash
npx expo build:ios
```

### Android

```bash
npx expo build:android
```

## Next Steps

- [ ] Add building details modal
- [ ] Implement bus stop predictions
- [ ] Add route filtering
- [ ] Save favorite buildings
- [ ] Add search functionality
- [ ] Implement turn-by-turn directions
- [ ] Add dark mode

## Tech Stack

- **Framework**: React Native + Expo
- **Maps**: react-native-maps
- **Location**: expo-location
- **HTTP Client**: axios
- **Backend**: FastAPI (Python) + C++

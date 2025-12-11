# Ronaldo Eats - Setup & Development Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

This will open the Expo Developer Tools. You can then:
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator

## Testing on Physical Devices

### iOS
1. Install [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from the App Store
2. Scan the QR code shown in the terminal with your Camera app
3. The app will open in Expo Go

### Android
1. Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Google Play
2. Scan the QR code shown in the terminal with the Expo Go app
3. The app will launch

## Development Workflow

### File Structure
- `App.tsx` - Main application entry point with navigation
- `src/screens/` - Screen components (Feed, Lists, Profile)
- `src/components/` - Reusable UI components
- `src/services/` - Business logic (Storage, Recommendations)
- `src/types/` - TypeScript type definitions
- `src/data/` - Mock data for development

### Key Features Implemented

1. **Feed Screen** (`FeedScreen.tsx`)
   - Location-based restaurant discovery
   - AI-powered recommendations
   - Restaurant rating system
   - Add to lists functionality

2. **Lists Screen** (`ListsScreen.tsx`)
   - Create custom restaurant lists
   - Manage saved restaurants
   - View list details

3. **Profile Screen** (`ProfileScreen.tsx`)
   - User statistics
   - Cuisine preferences visualization
   - Data management

### Services

#### StorageService
Handles all local data persistence using AsyncStorage:
- User ratings
- Custom lists
- User preferences
- CRUD operations for all data types

#### RecommendationService
AI-powered recommendation algorithm that considers:
- User's cuisine preferences (learned from ratings)
- Restaurant distance from user location
- Price level preferences
- Rating history
- Cuisine diversity

### Making Changes

1. **Adding a New Screen**
   - Create screen file in `src/screens/`
   - Add route in `App.tsx` navigation
   - Import and configure tab icon

2. **Modifying Recommendations**
   - Edit `RecommendationService.ts`
   - Adjust scoring weights in `calculateRecommendationScore()`
   - Test with different rating patterns

3. **Adding Mock Data**
   - Add restaurants to `src/data/mockRestaurants.ts`
   - Follow the Restaurant type interface
   - Include valid coordinates for location features

4. **Styling**
   - Each component has its own StyleSheet
   - Global color scheme uses `#FF6B6B` as primary color
   - Follow React Native styling conventions

## Testing

### Type Checking
```bash
npx tsc --noEmit
```

### Build Validation
```bash
npx expo export --output-dir /tmp/test-build
```

## Production Build

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Note: Requires EAS CLI and account setup. See [Expo documentation](https://docs.expo.dev/build/setup/).

## Troubleshooting

### Location Not Working
- Make sure you've granted location permissions
- Check that Location services are enabled on your device
- For iOS simulator, set a custom location in Features > Location

### Dependencies Issues
```bash
rm -rf node_modules
npm install
```

### Metro Bundler Cache Issues
```bash
npx expo start --clear
```

## Environment Setup

### Required
- Node.js 18+
- npm or yarn
- Expo Go app (for physical device testing)

### Optional
- Xcode (for iOS Simulator)
- Android Studio (for Android Emulator)
- EAS CLI (for production builds)

## Next Steps

### Integrating Real APIs
Replace mock data with real restaurant APIs:
- [Yelp Fusion API](https://www.yelp.com/developers/documentation/v3)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Foursquare Places API](https://developer.foursquare.com/)

### Adding Authentication
Implement user authentication:
- Expo AuthSession
- Firebase Authentication
- Auth0

### Cloud Sync
Enable cross-device sync:
- Firebase Realtime Database
- AWS Amplify
- Supabase

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

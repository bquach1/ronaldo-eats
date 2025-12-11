# Ronaldo Eats 🍽️

Ronaldo's Yelp with a Zillow interface - A React Native Expo application for discovering and saving restaurants with AI-powered recommendations.

## Features

- 📍 **Location-Based Feed**: Discover restaurants near you with distance information
- ⭐ **Restaurant Ratings**: Rate restaurants on a 1-5 star scale
- 🤖 **AI Recommendations**: Get personalized restaurant suggestions based on your ratings and preferences
- 📝 **Custom Lists**: Create and manage lists to organize your favorite restaurants
- 🍕 **Cuisine Preferences**: The app learns your cuisine preferences over time
- 💰 **Price Matching**: Recommendations adapt to your price preferences
- 📊 **Profile Stats**: Track your ratings, lists, and favorite cuisines

## Technology Stack

- **React Native** with **Expo** - Cross-platform mobile development
- **React Navigation** - Navigation between screens
- **TypeScript** - Type safety
- **AsyncStorage** - Local data persistence
- **Expo Location** - Geolocation services
- **Ionicons** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bquach1/ronaldo-eats.git
cd ronaldo-eats
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator or `a` for Android emulator

## Project Structure

```
ronaldo-eats/
├── App.tsx                 # Main app entry point with navigation
├── src/
│   ├── components/         # Reusable UI components
│   │   └── RestaurantCard.tsx
│   ├── screens/            # Main app screens
│   │   ├── FeedScreen.tsx
│   │   ├── ListsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/           # Business logic and data services
│   │   ├── StorageService.ts
│   │   └── RecommendationService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── data/               # Mock data
│       └── mockRestaurants.ts
├── assets/                 # Images and static assets
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

## How AI Recommendations Work

The app uses a sophisticated recommendation algorithm that considers:

1. **Cuisine Preferences**: Tracks which cuisines you rate highly and suggests more of them
2. **Distance**: Prioritizes restaurants closer to your location
3. **Price Matching**: Matches restaurants to your typical price preferences
4. **Rating History**: Learns from your overall rating patterns
5. **Diversity**: Ensures recommendations include a variety of cuisines

The more you rate, the better the recommendations become!

## Usage Guide

### Feed Screen
- Browse recommended restaurants based on your location and preferences
- Tap on a restaurant card to see full details
- Rate restaurants using the star button
- Save restaurants to your lists using the bookmark button
- Toggle between AI recommendations and all restaurants using the sparkle icon

### Lists Screen
- Create custom lists (e.g., "Favorites", "To Try", "Date Night")
- Add restaurants from the Feed to your lists
- View and manage restaurants in each list
- Remove restaurants from lists or delete entire lists

### Profile Screen
- View your rating statistics
- See your cuisine preferences visualized
- Understand how the AI recommendations work
- Clear all data if needed

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Future Enhancements

- Integration with real restaurant APIs (Yelp, Google Places)
- User authentication and cloud sync
- Social features (share lists, follow friends)
- Restaurant photos and reviews
- Advanced filters (dietary restrictions, open now, etc.)
- In-app directions to restaurants
- Push notifications for new recommendations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with React Native and Expo
- Restaurant images from Unsplash
- Icons from Ionicons

# Ronaldo Eats - App Architecture

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                             │
│                  (Navigation Container)                     │
└──────────────┬──────────────────┬───────────────┬──────────┘
               │                  │               │
       ┌───────▼────────┐ ┌──────▼──────┐ ┌─────▼──────┐
       │  Feed Screen   │ │ Lists Screen│ │Profile Screen│
       │                │ │             │ │             │
       └───────┬────────┘ └──────┬──────┘ └─────┬──────┘
               │                 │              │
               └─────────────────┴──────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   RestaurantCard       │
                    │   (Component)          │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │      Services          │
                    ├────────────────────────┤
                    │ • StorageService       │
                    │ • RecommendationService│
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Data & Types         │
                    ├────────────────────────┤
                    │ • Mock Restaurants     │
                    │ • TypeScript Interfaces│
                    └────────────────────────┘
```

## Data Flow

### Rating Flow
```
User rates restaurant
       ↓
RestaurantCard captures rating
       ↓
FeedScreen.handleRate()
       ↓
StorageService.saveRating()
       ↓
StorageService.updatePreferencesFromRating()
       ↓
Preferences updated with cuisine preferences
       ↓
FeedScreen.loadUserData()
       ↓
RecommendationService.getDiverseRecommendations()
       ↓
Feed updates with new recommendations
```

### List Management Flow
```
User creates list
       ↓
ListsScreen.handleCreateList()
       ↓
StorageService.saveList()
       ↓
Lists state updated
       ↓
User adds restaurant to list
       ↓
RestaurantCard shows lists modal
       ↓
FeedScreen.handleAddToList()
       ↓
StorageService.addRestaurantToList()
       ↓
List updated with restaurant
```

### Recommendation Algorithm
```
User location + Preferences + Ratings
       ↓
RecommendationService.getDiverseRecommendations()
       ↓
For each restaurant:
  - Calculate distance score
  - Calculate cuisine preference score
  - Calculate price level score
  - Calculate rating bonus
       ↓
Sort by total recommendation score
       ↓
Apply diversity filter (vary cuisines)
       ↓
Return top N recommendations
```

## Component Hierarchy

```
App
├── NavigationContainer
│   └── BottomTabNavigator
│       ├── FeedScreen
│       │   ├── FlatList
│       │   │   ├── Header (stats & filters)
│       │   │   └── RestaurantCard (multiple)
│       │   │       ├── Image
│       │   │       ├── Restaurant Info
│       │   │       ├── Action Buttons
│       │   │       └── Modals
│       │   │           ├── Details Modal
│       │   │           ├── Rating Modal
│       │   │           └── Lists Modal
│       │   └── RefreshControl
│       ├── ListsScreen
│       │   ├── Header
│       │   ├── FlatList (lists or restaurants)
│       │   └── Create List Modal
│       └── ProfileScreen
│           ├── Header (user avatar)
│           ├── Stats Grid
│           ├── Cuisine Preferences
│           ├── Price Preference
│           └── Info Cards
```

## State Management

### FeedScreen State
- `restaurants[]` - Current feed restaurants
- `userLocation` - User's GPS coordinates
- `preferences` - User preference object
- `userRatings[]` - All user ratings
- `lists[]` - All user lists
- `showRecommendations` - Toggle AI mode

### ListsScreen State
- `lists[]` - All user lists
- `selectedList` - Currently viewing list
- `showNewListModal` - Create list modal visibility
- `newListName` - Input for new list name

### ProfileScreen State
- `preferences` - User preference object
- `lists` - Count of user lists

## Data Models

### Restaurant
```typescript
{
  id: string
  name: string
  cuisine: string
  rating: number (1-5)
  priceLevel: number (1-4)
  description: string
  address: string
  latitude: number
  longitude: number
  image: string (URL)
  distance?: number (calculated)
}
```

### UserRating
```typescript
{
  restaurantId: string
  rating: number (1-5)
  timestamp: number
  cuisinePreference?: number
}
```

### UserList
```typescript
{
  id: string
  name: string
  restaurantIds: string[]
  createdAt: number
}
```

### UserPreferences
```typescript
{
  cuisinePreferences: { [cuisine: string]: number }
  priceLevelPreference: number
  averageRating: number
  totalRatings: number
}
```

## Storage Architecture

AsyncStorage Keys:
- `@ronaldo_eats_ratings` - Array of UserRating
- `@ronaldo_eats_lists` - Array of UserList
- `@ronaldo_eats_preferences` - UserPreferences object

All data persists locally on the device.

## Features Breakdown

### ✅ Implemented
- [x] Bottom tab navigation
- [x] Location-based restaurant feed
- [x] Restaurant rating system (1-5 stars)
- [x] AI-powered recommendations
- [x] Custom lists creation
- [x] Add/remove restaurants from lists
- [x] User preferences tracking
- [x] Cuisine preference learning
- [x] Distance-based sorting
- [x] Profile statistics
- [x] Data persistence (AsyncStorage)

### 🔄 Future Enhancements
- [ ] Real restaurant API integration
- [ ] User authentication
- [ ] Cloud data sync
- [ ] Social features (share lists)
- [ ] Restaurant photos gallery
- [ ] User reviews and notes
- [ ] Advanced filters (dietary, open now)
- [ ] Map view
- [ ] Directions to restaurants
- [ ] Push notifications
- [ ] Dark mode

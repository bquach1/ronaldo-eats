export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceLevel: number; // 1-4 ($, $$, $$$, $$$$)
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  distance?: number; // in miles
}

export interface UserRating {
  restaurantId: string;
  rating: number; // 1-5
  timestamp: number;
  cuisinePreference?: number; // -1 to 1 (dislike to like)
}

export interface UserList {
  id: string;
  name: string;
  restaurantIds: string[];
  createdAt: number;
}

export interface UserPreferences {
  cuisinePreferences: Record<string, number>; // cuisine type -> preference score
  priceLevelPreference: number; // 1-4
  averageRating: number;
  totalRatings: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

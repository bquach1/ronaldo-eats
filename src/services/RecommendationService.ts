import { Restaurant, UserPreferences, UserRating, Location } from '../types';

export class RecommendationService {
  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  /**
   * Calculate a recommendation score for a restaurant based on user preferences
   */
  static calculateRecommendationScore(
    restaurant: Restaurant,
    preferences: UserPreferences,
    userLocation?: Location
  ): number {
    let score = restaurant.rating * 20; // Base score from restaurant rating (0-100)

    // Cuisine preference bonus/penalty
    const cuisinePref = preferences.cuisinePreferences[restaurant.cuisine] || 0;
    score += cuisinePref * 20; // -20 to +20

    // Distance penalty (if location available)
    if (userLocation) {
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      );
      
      // Closer restaurants get higher scores
      if (distance < 1) {
        score += 15;
      } else if (distance < 3) {
        score += 10;
      } else if (distance < 5) {
        score += 5;
      } else if (distance > 10) {
        score -= 10;
      }
    }

    // Price level preference
    const priceDiff = Math.abs(restaurant.priceLevel - preferences.priceLevelPreference);
    score -= priceDiff * 5; // Penalty for price mismatch

    // Boost highly rated restaurants
    if (restaurant.rating >= 4.5) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score)); // Clamp between 0 and 100
  }

  /**
   * Sort restaurants by recommendation score
   */
  static getRecommendedRestaurants(
    restaurants: Restaurant[],
    preferences: UserPreferences,
    userLocation?: Location,
    excludeRated: boolean = false,
    userRatings: UserRating[] = []
  ): Restaurant[] {
    let filteredRestaurants = [...restaurants];

    // Optionally exclude already rated restaurants
    if (excludeRated) {
      const ratedIds = new Set(userRatings.map(r => r.restaurantId));
      filteredRestaurants = filteredRestaurants.filter(r => !ratedIds.has(r.id));
    }

    // Calculate distances if location is available
    if (userLocation) {
      filteredRestaurants = filteredRestaurants.map(restaurant => ({
        ...restaurant,
        distance: this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          restaurant.latitude,
          restaurant.longitude
        ),
      }));
    }

    // Sort by recommendation score
    return filteredRestaurants.sort((a, b) => {
      const scoreA = this.calculateRecommendationScore(a, preferences, userLocation);
      const scoreB = this.calculateRecommendationScore(b, preferences, userLocation);
      return scoreB - scoreA;
    });
  }

  /**
   * Get diverse recommendations (different cuisines)
   */
  static getDiverseRecommendations(
    restaurants: Restaurant[],
    preferences: UserPreferences,
    userLocation?: Location,
    count: number = 10
  ): Restaurant[] {
    const recommended = this.getRecommendedRestaurants(restaurants, preferences, userLocation);
    const diverse: Restaurant[] = [];
    const seenCuisines = new Set<string>();

    // First pass: get one of each cuisine
    for (const restaurant of recommended) {
      if (!seenCuisines.has(restaurant.cuisine)) {
        diverse.push(restaurant);
        seenCuisines.add(restaurant.cuisine);
      }
      if (diverse.length >= count) break;
    }

    // Second pass: fill remaining slots with highest scored
    if (diverse.length < count) {
      for (const restaurant of recommended) {
        if (!diverse.includes(restaurant)) {
          diverse.push(restaurant);
        }
        if (diverse.length >= count) break;
      }
    }

    return diverse;
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRating, UserList, UserPreferences } from '../types';

const RATINGS_KEY = '@ronaldo_eats_ratings';
const LISTS_KEY = '@ronaldo_eats_lists';
const PREFERENCES_KEY = '@ronaldo_eats_preferences';

export const StorageService = {
  // Ratings
  async getRatings(): Promise<UserRating[]> {
    try {
      const data = await AsyncStorage.getItem(RATINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting ratings:', error);
      return [];
    }
  },

  async saveRating(rating: UserRating): Promise<void> {
    try {
      const ratings = await this.getRatings();
      const existingIndex = ratings.findIndex(r => r.restaurantId === rating.restaurantId);
      
      if (existingIndex >= 0) {
        ratings[existingIndex] = rating;
      } else {
        ratings.push(rating);
      }
      
      await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  },

  async getRatingForRestaurant(restaurantId: string): Promise<UserRating | null> {
    try {
      const ratings = await this.getRatings();
      return ratings.find(r => r.restaurantId === restaurantId) || null;
    } catch (error) {
      console.error('Error getting rating for restaurant:', error);
      return null;
    }
  },

  // Lists
  async getLists(): Promise<UserList[]> {
    try {
      const data = await AsyncStorage.getItem(LISTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting lists:', error);
      return [];
    }
  },

  async saveList(list: UserList): Promise<void> {
    try {
      const lists = await this.getLists();
      const existingIndex = lists.findIndex(l => l.id === list.id);
      
      if (existingIndex >= 0) {
        lists[existingIndex] = list;
      } else {
        lists.push(list);
      }
      
      await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving list:', error);
    }
  },

  async deleteList(listId: string): Promise<void> {
    try {
      const lists = await this.getLists();
      const filtered = lists.filter(l => l.id !== listId);
      await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  },

  async addRestaurantToList(listId: string, restaurantId: string): Promise<void> {
    try {
      const lists = await this.getLists();
      const list = lists.find(l => l.id === listId);
      
      if (list && !list.restaurantIds.includes(restaurantId)) {
        list.restaurantIds.push(restaurantId);
        await this.saveList(list);
      }
    } catch (error) {
      console.error('Error adding restaurant to list:', error);
    }
  },

  async removeRestaurantFromList(listId: string, restaurantId: string): Promise<void> {
    try {
      const lists = await this.getLists();
      const list = lists.find(l => l.id === listId);
      
      if (list) {
        list.restaurantIds = list.restaurantIds.filter(id => id !== restaurantId);
        await this.saveList(list);
      }
    } catch (error) {
      console.error('Error removing restaurant from list:', error);
    }
  },

  // Preferences
  async getPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(PREFERENCES_KEY);
      return data ? JSON.parse(data) : {
        cuisinePreferences: {},
        priceLevelPreference: 2,
        averageRating: 0,
        totalRatings: 0,
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {
        cuisinePreferences: {},
        priceLevelPreference: 2,
        averageRating: 0,
        totalRatings: 0,
      };
    }
  },

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  async updatePreferencesFromRating(rating: UserRating, cuisine: string): Promise<void> {
    try {
      const preferences = await this.getPreferences();
      
      // Update cuisine preferences
      const currentPref = preferences.cuisinePreferences[cuisine] || 0;
      const ratingWeight = (rating.rating - 3) / 2; // -1 to 1 scale
      preferences.cuisinePreferences[cuisine] = (currentPref + ratingWeight) / 2;
      
      // Update average rating
      const newTotal = preferences.totalRatings + 1;
      preferences.averageRating = 
        (preferences.averageRating * preferences.totalRatings + rating.rating) / newTotal;
      preferences.totalRatings = newTotal;
      
      await this.savePreferences(preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([RATINGS_KEY, LISTS_KEY, PREFERENCES_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};

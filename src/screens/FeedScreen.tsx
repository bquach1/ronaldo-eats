import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant, UserRating, UserPreferences, UserList } from '../types';
import { MOCK_RESTAURANTS } from '../data/mockRestaurants';
import { StorageService } from '../services/StorageService';
import { RecommendationService } from '../services/RecommendationService';

export default function FeedScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    cuisinePreferences: {},
    priceLevelPreference: 2,
    averageRating: 0,
    totalRatings: 0,
  });
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [lists, setLists] = useState<UserList[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    await requestLocationPermission();
    await loadUserData();
    setLoading(false);
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadUserData = async () => {
    const [prefs, ratings, userLists] = await Promise.all([
      StorageService.getPreferences(),
      StorageService.getRatings(),
      StorageService.getLists(),
    ]);

    setPreferences(prefs);
    setUserRatings(ratings);
    setLists(userLists);

    // Generate recommendations
    updateRecommendations(prefs, ratings);
  };

  const updateRecommendations = (prefs: UserPreferences, ratings: UserRating[]) => {
    if (showRecommendations && prefs.totalRatings > 0) {
      // Use AI-powered recommendations based on user preferences
      const recommended = RecommendationService.getDiverseRecommendations(
        MOCK_RESTAURANTS,
        prefs,
        userLocation || undefined,
        10
      );
      setRestaurants(recommended);
    } else {
      // Show all restaurants sorted by rating and distance
      let sorted = [...MOCK_RESTAURANTS];
      if (userLocation) {
        sorted = sorted.map(r => ({
          ...r,
          distance: RecommendationService.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            r.latitude,
            r.longitude
          ),
        }));
        sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      } else {
        sorted.sort((a, b) => b.rating - a.rating);
      }
      setRestaurants(sorted);
    }
  };

  const handleRate = async (restaurantId: string, rating: number) => {
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === restaurantId);
    if (!restaurant) return;

    const userRating: UserRating = {
      restaurantId,
      rating,
      timestamp: Date.now(),
    };

    await StorageService.saveRating(userRating);
    await StorageService.updatePreferencesFromRating(userRating, restaurant.cuisine);

    // Reload data and refresh recommendations
    await loadUserData();
    
    Alert.alert('Success', 'Your rating has been saved and recommendations updated!');
  };

  const handleAddToList = async (restaurantId: string, listId: string) => {
    await StorageService.addRestaurantToList(listId, restaurantId);
    const updatedLists = await StorageService.getLists();
    setLists(updatedLists);
    Alert.alert('Success', 'Restaurant added to list!');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const toggleRecommendationMode = () => {
    setShowRecommendations(!showRecommendations);
    updateRecommendations(preferences, userRatings);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>
            {userLocation ? 'Restaurants near you' : 'Loading location...'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleRecommendationMode}
        >
          <Ionicons 
            name={showRecommendations ? 'sparkles' : 'list'} 
            size={24} 
            color="#FF6B6B" 
          />
        </TouchableOpacity>
      </View>

      {preferences.totalRatings > 0 && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Preferences</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{preferences.totalRatings}</Text>
              <Text style={styles.statLabel}>Ratings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{preferences.averageRating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Object.keys(preferences.cuisinePreferences).length}
              </Text>
              <Text style={styles.statLabel}>Cuisines</Text>
            </View>
          </View>
          {showRecommendations && (
            <View style={styles.recommendationBadge}>
              <Ionicons name="sparkles" size={14} color="#FF6B6B" />
              <Text style={styles.recommendationText}>AI-Powered Recommendations</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No restaurants found</Text>
      <Text style={styles.emptyText}>Check your location permissions</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const userRating = userRatings.find(r => r.restaurantId === item.id);
          return (
            <RestaurantCard
              restaurant={item}
              onRate={(rating) => handleRate(item.id, rating)}
              onAddToList={(listId) => handleAddToList(item.id, listId)}
              userRating={userRating?.rating}
              lists={lists}
            />
          );
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B6B"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  list: {
    paddingBottom: 16,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  recommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    gap: 6,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

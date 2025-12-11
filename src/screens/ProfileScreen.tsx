import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/StorageService';
import { UserPreferences } from '../types';

export default function ProfileScreen() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    cuisinePreferences: {},
    priceLevelPreference: 2,
    averageRating: 0,
    totalRatings: 0,
  });
  const [lists, setLists] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prefs = await StorageService.getPreferences();
    const userLists = await StorageService.getLists();
    setPreferences(prefs);
    setLists(userLists.length);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your ratings, lists, and preferences? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAll();
            await loadData();
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const getTopCuisines = () => {
    const cuisines = Object.entries(preferences.cuisinePreferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    return cuisines;
  };

  const getPriceLevelString = (level: number) => {
    return '$'.repeat(level);
  };

  const getPreferenceEmoji = (score: number) => {
    if (score > 0.3) return '❤️';
    if (score > 0) return '👍';
    if (score < -0.3) return '👎';
    return '😐';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#FF6B6B" />
        </View>
        <Text style={styles.username}>Ronaldo</Text>
        <Text style={styles.subtitle}>Food Explorer</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="star" size={28} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>{preferences.totalRatings}</Text>
            <Text style={styles.statLabel}>Ratings</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="bookmark" size={28} color="#FF6B6B" />
            </View>
            <Text style={styles.statValue}>{lists}</Text>
            <Text style={styles.statLabel}>Lists</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="restaurant" size={28} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>
              {Object.keys(preferences.cuisinePreferences).length}
            </Text>
            <Text style={styles.statLabel}>Cuisines</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="trophy" size={28} color="#FFA500" />
            </View>
            <Text style={styles.statValue}>
              {preferences.averageRating > 0 ? preferences.averageRating.toFixed(1) : '—'}
            </Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      {preferences.totalRatings > 0 && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuisine Preferences</Text>
            {getTopCuisines().length > 0 ? (
              <View style={styles.cuisinesList}>
                {getTopCuisines().map(([cuisine, score]) => (
                  <View key={cuisine} style={styles.cuisineItem}>
                    <View style={styles.cuisineInfo}>
                      <Text style={styles.cuisineEmoji}>
                        {getPreferenceEmoji(score)}
                      </Text>
                      <Text style={styles.cuisineName}>{cuisine}</Text>
                    </View>
                    <View style={styles.scoreBar}>
                      <View
                        style={[
                          styles.scoreBarFill,
                          {
                            width: `${Math.abs(score) * 100}%`,
                            backgroundColor: score > 0 ? '#4CAF50' : '#FF6B6B',
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                Rate more restaurants to see your preferences
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Preference</Text>
            <View style={styles.priceCard}>
              <Text style={styles.priceValue}>
                {getPriceLevelString(Math.round(preferences.priceLevelPreference))}
              </Text>
              <Text style={styles.priceLabel}>
                Your preferred price range
              </Text>
            </View>
          </View>
        </>
      )}

      {/* How It Works Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How AI Recommendations Work</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="sparkles" size={20} color="#FF6B6B" />
            <Text style={styles.infoText}>
              Rate restaurants to teach the AI your preferences
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="trending-up" size={20} color="#FF6B6B" />
            <Text style={styles.infoText}>
              Your feed adapts based on cuisines you love
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location" size={20} color="#FF6B6B" />
            <Text style={styles.infoText}>
              Closer restaurants are prioritized in your feed
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cash" size={20} color="#FF6B6B" />
            <Text style={styles.infoText}>
              Recommendations match your price preferences
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClearData}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ronaldo Eats v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ for food lovers</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  cuisinesList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  cuisineItem: {
    marginBottom: 16,
  },
  cuisineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cuisineEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  cuisineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  priceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});

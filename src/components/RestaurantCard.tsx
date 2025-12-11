import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant, UserList } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onRate?: (rating: number) => void;
  onAddToList?: (listId: string) => void;
  userRating?: number;
  lists?: UserList[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function RestaurantCard({
  restaurant,
  onRate,
  onAddToList,
  userRating,
  lists = [],
}: RestaurantCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showLists, setShowLists] = useState(false);

  const handleRate = (rating: number) => {
    onRate?.(rating);
    setShowRating(false);
  };

  const getPriceString = (level: number) => {
    return '$'.repeat(level);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowDetails(true)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          </View>

          <View style={styles.metadata}>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            <Text style={styles.price}>{getPriceString(restaurant.priceLevel)}</Text>
            {restaurant.distance && (
              <Text style={styles.distance}>{restaurant.distance.toFixed(1)} mi</Text>
            )}
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {restaurant.description}
          </Text>

          {userRating && (
            <View style={styles.userRatingBadge}>
              <Text style={styles.userRatingText}>Your rating: {userRating} ⭐</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowRating(true)}
            >
              <Ionicons name="star-outline" size={20} color="#FF6B6B" />
              <Text style={styles.actionText}>Rate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowLists(true)}
            >
              <Ionicons name="bookmark-outline" size={20} color="#FF6B6B" />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Details Modal */}
      <Modal
        visible={showDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Image source={{ uri: restaurant.image }} style={styles.modalImage} />
              
              <View style={styles.modalBody}>
                <Text style={styles.modalName}>{restaurant.name}</Text>
                
                <View style={styles.modalMetadata}>
                  <View style={styles.modalBadge}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.modalBadgeText}>{restaurant.rating}</Text>
                  </View>
                  <Text style={styles.modalBadgeText}>{restaurant.cuisine}</Text>
                  <Text style={styles.modalBadgeText}>{getPriceString(restaurant.priceLevel)}</Text>
                </View>

                <Text style={styles.modalDescription}>{restaurant.description}</Text>
                
                <View style={styles.modalAddress}>
                  <Ionicons name="location" size={16} color="#666" />
                  <Text style={styles.modalAddressText}>{restaurant.address}</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rating Modal */}
      <Modal
        visible={showRating}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowRating(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ratingModal}>
            <Text style={styles.ratingModalTitle}>Rate {restaurant.name}</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRate(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= (userRating || 0) ? 'star' : 'star-outline'}
                    size={40}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRating(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lists Modal */}
      <Modal
        visible={showLists}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLists(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.listsModal}>
            <Text style={styles.listsModalTitle}>Add to List</Text>
            
            <ScrollView style={styles.listsList}>
              {lists.length === 0 ? (
                <Text style={styles.noListsText}>
                  No lists yet. Create one in the Lists tab!
                </Text>
              ) : (
                lists.map((list) => (
                  <TouchableOpacity
                    key={list.id}
                    style={styles.listItem}
                    onPress={() => {
                      onAddToList?.(list.id);
                      setShowLists(false);
                    }}
                  >
                    <Text style={styles.listName}>{list.name}</Text>
                    <Text style={styles.listCount}>{list.restaurantIds.length} places</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowLists(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  metadata: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  cuisine: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  distance: {
    fontSize: 14,
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  userRatingBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  userRatingText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  modalBody: {
    padding: 20,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalMetadata: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  modalAddressText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 16,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  ratingModal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  ratingModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  starButton: {
    padding: 4,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#999',
  },
  listsModal: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  listsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  listsList: {
    maxHeight: 300,
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listCount: {
    fontSize: 12,
    color: '#999',
  },
  noListsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});

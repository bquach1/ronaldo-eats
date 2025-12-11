import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserList, Restaurant } from '../types';
import { StorageService } from '../services/StorageService';
import { MOCK_RESTAURANTS } from '../data/mockRestaurants';

export default function ListsScreen() {
  const [lists, setLists] = useState<UserList[]>([]);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState<UserList | null>(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    const userLists = await StorageService.getLists();
    setLists(userLists);
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    const newList: UserList = {
      id: Date.now().toString(),
      name: newListName,
      restaurantIds: [],
      createdAt: Date.now(),
    };

    await StorageService.saveList(newList);
    await loadLists();
    setNewListName('');
    setShowNewListModal(false);
    Alert.alert('Success', 'List created!');
  };

  const handleDeleteList = async (listId: string) => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteList(listId);
            await loadLists();
            if (selectedList?.id === listId) {
              setSelectedList(null);
            }
          },
        },
      ]
    );
  };

  const handleRemoveFromList = async (listId: string, restaurantId: string) => {
    await StorageService.removeRestaurantFromList(listId, restaurantId);
    await loadLists();
    
    // Update selected list
    if (selectedList?.id === listId) {
      const updated = await StorageService.getLists();
      const updatedList = updated.find(l => l.id === listId);
      setSelectedList(updatedList || null);
    }
  };

  const getRestaurantsByIds = (ids: string[]): Restaurant[] => {
    return ids
      .map(id => MOCK_RESTAURANTS.find(r => r.id === id))
      .filter((r): r is Restaurant => r !== undefined);
  };

  const renderListItem = ({ item }: { item: UserList }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => setSelectedList(item)}
    >
      <View style={styles.listCardContent}>
        <View style={styles.listIcon}>
          <Ionicons name="bookmark" size={24} color="#FF6B6B" />
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.listCount}>
            {item.restaurantIds.length} {item.restaurantIds.length === 1 ? 'place' : 'places'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteList(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRestaurantInList = ({ item }: { item: Restaurant }) => (
    <View style={styles.restaurantCard}>
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
        <View style={styles.restaurantRating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.restaurantRatingText}>{item.rating}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => selectedList && handleRemoveFromList(selectedList.id, item.id)}
      >
        <Ionicons name="close-circle" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyLists = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bookmark-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No lists yet</Text>
      <Text style={styles.emptyText}>Create a list to save your favorite restaurants</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowNewListModal(true)}
      >
        <Text style={styles.createButtonText}>Create Your First List</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No restaurants in this list</Text>
      <Text style={styles.emptyText}>Add restaurants from the Feed tab</Text>
    </View>
  );

  if (selectedList) {
    const restaurants = getRestaurantsByIds(selectedList.restaurantIds);
    
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedList(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <View style={styles.listHeaderInfo}>
            <Text style={styles.listHeaderTitle}>{selectedList.name}</Text>
            <Text style={styles.listHeaderSubtitle}>
              {selectedList.restaurantIds.length} {selectedList.restaurantIds.length === 1 ? 'place' : 'places'}
            </Text>
          </View>
        </View>

        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurantInList}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmptyList}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Lists</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewListModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyLists}
      />

      {/* New List Modal */}
      <Modal
        visible={showNewListModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowNewListModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New List</Text>
            
            <TextInput
              style={styles.input}
              placeholder="List name (e.g., Favorites, To Try)"
              value={newListName}
              onChangeText={setNewListName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setNewListName('');
                  setShowNewListModal(false);
                }}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreateList}
              >
                <Text style={styles.createModalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listCount: {
    fontSize: 14,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  listHeaderInfo: {
    flex: 1,
  },
  listHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listHeaderSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 4,
  },
  restaurantRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantRatingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
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
  createButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#FF6B6B',
    borderRadius: 24,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  createModalButton: {
    backgroundColor: '#FF6B6B',
  },
  createModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

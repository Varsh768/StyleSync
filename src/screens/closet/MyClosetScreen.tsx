import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClosetStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ClosetItem } from '../../types';
import { getClosetItems, StoredClosetItem } from '../../services/localStorage';

type MyClosetScreenNavigationProp = StackNavigationProp<ClosetStackParamList, 'MyCloset'>;

interface Props {
  navigation: MyClosetScreenNavigationProp;
}

const MyClosetScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    if (!user) return;

    try {
      // Load items from local storage (hardcoded, no Firebase)
      const storedItems = await getClosetItems(user.id);
      
      // Convert stored items to ClosetItem format
      const itemsData: ClosetItem[] = storedItems
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((item) => ({
          id: item.id,
          ownerId: item.ownerId,
          images: item.images,
          title: item.title,
          category: item.category,
          brand: item.brand,
          size: item.size,
          notes: item.notes,
          isActive: item.isActive,
          createdAt: new Date(item.createdAt),
        }));
      
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [user]);

  // Reload items when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [user])
  );

  const renderItem = ({ item }: { item: ClosetItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    >
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
        {item.size && <Text style={styles.itemSize}>Size: {item.size}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Closet</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your closet is empty</Text>
          <Text style={styles.emptySubtext}>Add your first item to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadItems} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  itemCard: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
  },
  itemInfo: {
    padding: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemSize: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MyClosetScreen;


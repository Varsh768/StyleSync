import React, { useEffect, useState } from 'react';
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
// FIREBASE COMMENTED OUT FOR TESTING
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
// import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { ClosetItem } from '../../types';

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
      // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
      // const q = query(
      //   collection(db, 'closet_items'),
      //   where('ownerId', '==', user.id),
      //   where('isActive', '==', true),
      //   orderBy('createdAt', 'desc')
      // );
      // const snapshot = await getDocs(q);
      // const itemsData = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      //   createdAt: doc.data().createdAt?.toDate() || new Date(),
      // })) as ClosetItem[];
      // setItems(itemsData);
      
      // Mock: Return empty array
      setItems([]);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [user]);

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
      <Text style={styles.itemCategory}>{item.category}</Text>
      {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
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
  itemCategory: {
    padding: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  itemBrand: {
    paddingHorizontal: 10,
    paddingBottom: 10,
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


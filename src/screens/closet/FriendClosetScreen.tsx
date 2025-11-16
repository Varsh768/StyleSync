import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ClosetStackParamList, SocialStackParamList } from '../../types';
// FIREBASE COMMENTED OUT FOR TESTING
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
// import { db } from '../../services/firebase';
import { ClosetItem } from '../../types';
import CategoryDropdown from '../../components/CategoryDropdown';

type FriendClosetScreenNavigationProp = StackNavigationProp<
  SocialStackParamList,
  'FriendCloset'
>;
type FriendClosetScreenRouteProp = RouteProp<SocialStackParamList, 'FriendCloset'>;

interface Props {
  navigation: FriendClosetScreenNavigationProp;
  route: FriendClosetScreenRouteProp;
}

const CATEGORIES = [
  'Top',
  'Bottom',
  'Dress',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Saree',
  'Blazer',
  'Other',
];

const FriendClosetScreen: React.FC<Props> = ({ navigation, route }) => {
  const { friendId, friendName } = route.params;
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadItems = async () => {
    // FIREBASE COMMENTED OUT - HARDCODED DATA FOR TESTING
    try {
      // Hardcoded items for Sarah's closet
      // Check for both 'sarah-id' (used in feed) and 'user-sarah-1' (used in user profiles)
      if (friendId === 'sarah-id' || friendId === 'user-sarah-1') {
        const sarahItems: ClosetItem[] = [
          {
            id: 'sarah-item-1',
            ownerId: friendId,
            images: ['https://i.pinimg.com/736x/2b/26/a2/2b26a22bb910c539a4e7067582c220a6.jpg'],
            title: 'White Top',
            brand: 'Abercrombie',
            size: 'S',
            category: 'Top',
            isActive: true,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          },
          {
            id: 'sarah-item-2',
            ownerId: friendId,
            images: ['https://i.pinimg.com/1200x/25/6c/3b/256c3bae47c362f0bd38eb257e114e83.jpg'],
            title: 'Brown Tank Top',
            brand: 'Zara',
            size: 'M',
            category: 'Top',
            isActive: true,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          },
        ];
        setItems(sarahItems);
      } else if (friendId === 'tanya-id' || friendId === 'user-tanya-1') {
        // Hardcoded items for Tanya's closet
        const tanyaItems: ClosetItem[] = [
          {
            id: 'tanya-item-1',
            ownerId: friendId,
            images: ['https://i.pinimg.com/736x/0e/6f/53/0e6f530f53e2ce25860a02e73921e6cd.jpg'],
            title: 'Polka Dot Top',
            brand: 'Pacsun',
            size: 'L',
            category: 'Top',
            isActive: true,
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
          },
          {
            id: 'tanya-item-2',
            ownerId: friendId,
            images: ['https://i.pinimg.com/736x/01/42/94/0142940ca472fd70b974fb50e665afde.jpg'],
            title: 'Yellow Sweatpants',
            brand: 'Edikted',
            size: 'L',
            category: 'Bottom',
            isActive: true,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
          },
        ];
        setItems(tanyaItems);
      } else if (friendId === 'veronica-id' || friendId === 'user-veronica-1') {
        // Hardcoded items for Veronica's closet
        const veronicaItems: ClosetItem[] = [
          {
            id: 'veronica-item-1',
            ownerId: friendId,
            images: ['https://i.pinimg.com/1200x/af/70/56/af70564e422f286eb55caf5b4283c543.jpg'],
            title: 'Jeans',
            brand: 'Levis',
            size: '2',
            category: 'Bottom',
            isActive: true,
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
          },
          {
            id: 'veronica-item-2',
            ownerId: friendId,
            images: ['https://i.pinimg.com/736x/92/76/46/927646faa38323f2c34cea9aff7bab65.jpg'],
            title: 'Sambas',
            brand: 'Adidas',
            size: '8',
            category: 'Shoes',
            isActive: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          },
        ];
        setItems(veronicaItems);
      } else {
        // For other friends, return empty array
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [friendId]);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query (searches in title, brand, notes, category, size)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const searchableText = [
          item.title,
          item.brand,
          item.notes,
          item.category,
          item.size,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchableText.includes(query);
      });
    }

    return filtered;
  }, [items, selectedCategory, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
  };

  const renderItem = ({ item }: { item: ClosetItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => {
        // Navigate to ItemDetail in Closet tab
        (navigation as any).navigate('Closet', {
          screen: 'ItemDetail',
          params: { itemId: item.id, friendId },
        });
      }}
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
      {/* Filter and Search Section */}
      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, brand, notes..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.filterRow}>
          <View style={styles.categoryFilterContainer}>
            <CategoryDropdown
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
              categories={['', ...CATEGORIES]}
              placeholder="All Categories"
            />
          </View>
          {(selectedCategory || searchQuery) && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {items.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>This closet is empty</Text>
        </View>
      ) : filteredItems.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filter criteria
          </Text>
          {(selectedCategory || searchQuery) && (
            <TouchableOpacity style={styles.clearFiltersButtonLarge} onPress={clearFilters}>
              <Text style={styles.clearFiltersButtonLargeText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredItems}
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
  filterSection: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryFilterContainer: {
    flex: 1,
  },
  clearFiltersButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearFiltersText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  clearFiltersButtonLarge: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignSelf: 'center',
  },
  clearFiltersButtonLargeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FriendClosetScreen;


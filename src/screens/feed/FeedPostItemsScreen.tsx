import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FeedStackParamList, ClosetItem } from '../../types';

type FeedPostItemsScreenNavigationProp = StackNavigationProp<
  FeedStackParamList,
  'FeedPostItems'
>;
type FeedPostItemsScreenRouteProp = RouteProp<FeedStackParamList, 'FeedPostItems'>;

interface Props {
  navigation: FeedPostItemsScreenNavigationProp;
  route: FeedPostItemsScreenRouteProp;
}

// ============================================================================
// ADD YOUR ITEMS HERE!
// Format for each item in the array:
// {
//   imageUrl: 'https://your-image-url.jpg',  // The image URL for the clothing item
//   title: 'Item Name',                       // Name of the clothing item
//   brand: 'Brand Name',                      // Brand (optional, can be empty string)
//   size: 'S/M/L/etc',                        // Size (optional, can be empty string)
//   category: 'Top/Bottom/Shoes/etc'          // Category of the item
// }
// ============================================================================

const FEED_POST_ITEMS_DATA: { [postId: string]: Array<{
  imageUrl: string;
  title: string;
  brand: string;
  size: string;
  category: string;
}> } = {
  // Example: 'post-1' is the post ID from FeedListScreen
  'post-1': [
    {
      imageUrl: 'https://i.pinimg.com/736x/6f/3a/73/6f3a739cbaa52d4cc6bdc8c05357776f.jpg',
      title: 'Yellow Tube Top',
      brand: 'Garage',
      size: 'M',
      category: 'Top',
    },
    {
      imageUrl: 'https://i.pinimg.com/736x/f0/bb/56/f0bb56ef76ad8a0c81320200230a43da.jpg',
      title: 'White linen pants',
      brand: 'Princess Polly',
      size: '28',
      category: 'Bottom',
    },
  ],
  'post-2': [
    {
      imageUrl: 'https://i.pinimg.com/736x/7c/cb/df/7ccbdfd95d4521648043eef3b9c594a3.jpg',
      title: 'Grey Cardigan',
      brand: 'H&M',
      size: 'M',
      category: 'Outerwear',
    },
    {
      imageUrl: 'https://i.pinimg.com/736x/68/73/d9/6873d90c1d3dad8a934023d04822ea15.jpg',
      title: 'White Jeans',
      brand: 'Princess Polly',
      size: '28',
      category: 'Bottom',
    },
  ],
  

  // Add more post IDs and their items here!
  // 'post-2': [
  //   { imageUrl: '...', title: '...', brand: '...', size: '...', category: '...' },
  // ],
};

const FeedPostItemsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { postId, authorName } = route.params;
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [requestedItems, setRequestedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Get items for this specific post
    const postItemsData = FEED_POST_ITEMS_DATA[postId] || [];

    // Convert to ClosetItem format
    const convertedItems: ClosetItem[] = postItemsData.map((item, index) => ({
      id: `${postId}-item-${index}`,
      ownerId: postId,
      images: item.imageUrl ? [item.imageUrl] : [],
      title: item.title,
      brand: item.brand,
      size: item.size,
      category: item.category,
      isActive: true,
      createdAt: new Date(),
    }));

    setItems(convertedItems);
  }, [postId]);

  const handleRequestItem = (item: ClosetItem) => {
    // Add item to requested items set
    setRequestedItems(prev => new Set(prev).add(item.id));

    // Show alert
    Alert.alert('Alert sent!', `Your request for "${item.title}" has been sent.`, [
      { text: 'OK' }
    ]);

    // In the future, this would create an actual request
    // navigation.navigate('Closet', {
    //   screen: 'CreateRequest',
    //   params: { itemId: item.id, friendId: item.ownerId }
    // });
  };

  const renderItem = ({ item }: { item: ClosetItem }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity
        style={styles.itemTouchable}
        onPress={() => {
          // Navigate to ItemDetail - in the future this would show the actual item
          console.log('Item clicked:', item.id);
        }}
      >
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="shirt-outline" size={60} color="#ccc" />
            <Text style={styles.placeholderText}>Placeholder</Text>
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
          {item.size && <Text style={styles.itemSize}>Size: {item.size}</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.requestButton,
          requestedItems.has(item.id) && styles.requestButtonDisabled
        ]}
        onPress={() => handleRequestItem(item)}
        disabled={requestedItems.has(item.id)}
      >
        <Ionicons
          name={requestedItems.has(item.id) ? "checkmark-circle-outline" : "send-outline"}
          size={16}
          color={requestedItems.has(item.id) ? "#999" : "#fff"}
        />
        <Text style={[
          styles.requestButtonText,
          requestedItems.has(item.id) && styles.requestButtonTextDisabled
        ]}>
          {requestedItems.has(item.id) ? 'Request Pending' : 'Request Item'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Items in this post</Text>
        {authorName && <Text style={styles.headerSubtitle}>by {authorName}</Text>}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shirt-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No items requestable</Text>
          <Text style={styles.emptySubtext}>This post doesn't have any items available to request</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
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
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 10,
  },
  itemCard: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemTouchable: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999',
    marginTop: 8,
    fontSize: 12,
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
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
    marginTop: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  requestButtonDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.7,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  requestButtonTextDisabled: {
    color: '#999',
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
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default FeedPostItemsScreen;

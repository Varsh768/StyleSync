import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ClosetStackParamList, RequestsStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ClosetItem } from '../../types';
import { getClosetItem } from '../../services/localStorage';

type ItemDetailScreenNavigationProp = StackNavigationProp<ClosetStackParamList, 'ItemDetail'>;
type ItemDetailScreenRouteProp = RouteProp<ClosetStackParamList, 'ItemDetail'>;

interface Props {
  navigation: ItemDetailScreenNavigationProp;
  route: ItemDetailScreenRouteProp;
}

const ItemDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { itemId, friendId } = route.params;
  const { user } = useAuth();
  const [item, setItem] = useState<ClosetItem | null>(null);
  const [loading, setLoading] = useState(true);
  const isOwnItem = !friendId || friendId === user?.id;

  useEffect(() => {
    loadItem();
  }, [itemId]);

  const loadItem = async () => {
    try {
      // Load item from local storage (hardcoded, no Firebase)
      const storedItem = await getClosetItem(itemId);
      if (storedItem) {
        setItem({
          id: storedItem.id,
          ownerId: storedItem.ownerId,
          images: storedItem.images,
          title: storedItem.title,
          category: storedItem.category,
          brand: storedItem.brand,
          size: storedItem.size,
          notes: storedItem.notes,
          isActive: storedItem.isActive,
          createdAt: new Date(storedItem.createdAt),
        });
      } else {
        Alert.alert('Error', 'Item not found');
      }
    } catch (error) {
      console.error('Error loading item:', error);
      Alert.alert('Error', 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = () => {
    if (!friendId) return;
    // Navigate to create request screen
    (navigation as any).navigate('Requests', {
      screen: 'CreateRequest',
      params: { itemId, friendId },
    });
  };

  const handleEdit = () => {
    navigation.navigate('EditItem', { itemId });
  };

  if (loading || !item) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {item.images && item.images.length > 0 && (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {item.images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </ScrollView>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        {item.brand && <Text style={styles.brand}>{item.brand}</Text>}
        {item.size && <Text style={styles.size}>Size: {item.size}</Text>}
        
        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notes}>{item.notes}</Text>
          </View>
        )}

        {isOwnItem ? (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit Item</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
            <Text style={styles.requestButtonText}>Request to Borrow</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  size: {
    fontSize: 16,
    marginBottom: 10,
  },
  notesSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  notes: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ItemDetailScreen;


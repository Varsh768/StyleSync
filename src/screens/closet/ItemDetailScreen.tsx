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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { ClosetItem } from '../../types';

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
      const itemDoc = await getDoc(doc(db, 'closet_items', itemId));
      if (itemDoc.exists()) {
        const data = itemDoc.data();
        setItem({
          id: itemDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as ClosetItem);
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
        <Text style={styles.category}>{item.category}</Text>
        {item.brand && <Text style={styles.brand}>{item.brand}</Text>}
        {item.size && <Text style={styles.size}>Size: {item.size}</Text>}
        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}

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
  category: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
  notes: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
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


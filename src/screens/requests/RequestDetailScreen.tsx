import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RequestsStackParamList } from '../../types';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { BorrowRequest, ClosetItem, User } from '../../types';

type RequestDetailScreenNavigationProp = StackNavigationProp<
  RequestsStackParamList,
  'RequestDetail'
>;
type RequestDetailScreenRouteProp = RouteProp<RequestsStackParamList, 'RequestDetail'>;

interface Props {
  navigation: RequestDetailScreenNavigationProp;
  route: RequestDetailScreenRouteProp;
}

const RequestDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { requestId } = route.params;
  const { user } = useAuth();
  const [request, setRequest] = useState<BorrowRequest | null>(null);
  const [item, setItem] = useState<ClosetItem | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
    try {
      const requestDoc = await getDoc(doc(db, 'borrow_requests', requestId));
      if (requestDoc.exists()) {
        const data = requestDoc.data();
        const requestData = {
          id: requestDoc.id,
          ...data,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        } as BorrowRequest;
        setRequest(requestData);

        // Load item
        const itemDoc = await getDoc(doc(db, 'closet_items', requestData.itemId));
        if (itemDoc.exists()) {
          const itemData = itemDoc.data();
          setItem({
            id: itemDoc.id,
            ...itemData,
            createdAt: itemData.createdAt?.toDate() || new Date(),
          } as ClosetItem);
        }

        // Load other user
        const otherUserId =
          requestData.borrowerId === user?.id ? requestData.lenderId : requestData.borrowerId;
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setOtherUser({
            id: userDoc.id,
            ...userData,
            createdAt: userData.createdAt?.toDate() || new Date(),
          } as User);
        }
      }
    } catch (error) {
      console.error('Error loading request:', error);
      Alert.alert('Error', 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!request) return;

    try {
      await updateDoc(doc(db, 'borrow_requests', request.id), { status: 'accepted' });
      Alert.alert('Success', 'Request accepted!');
      loadRequest();
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleDecline = async () => {
    if (!request) return;

    Alert.alert('Decline Request', 'Are you sure you want to decline this request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          try {
            await updateDoc(doc(db, 'borrow_requests', request.id), { status: 'declined' });
            Alert.alert('Success', 'Request declined');
            loadRequest();
          } catch (error) {
            console.error('Error declining request:', error);
            Alert.alert('Error', 'Failed to decline request');
          }
        },
      },
    ]);
  };

  const handleComplete = async () => {
    if (!request) return;

    try {
      await updateDoc(doc(db, 'borrow_requests', request.id), { status: 'completed' });
      Alert.alert('Success', 'Request marked as completed!');
      loadRequest();
    } catch (error) {
      console.error('Error completing request:', error);
      Alert.alert('Error', 'Failed to mark request as completed');
    }
  };

  if (loading || !request || !item) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isLender = request.lenderId === user?.id;
  const canAccept = isLender && request.status === 'pending';
  const canComplete = request.status === 'accepted';

  return (
    <ScrollView style={styles.container}>
      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
      )}

      <View style={styles.content}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
        {item.size && <Text style={styles.itemSize}>Size: {item.size}</Text>}

        <View style={styles.section}>
          <Text style={styles.label}>
            {isLender ? 'Borrower' : 'Lender'}: {otherUser?.name || 'Unknown'}
          </Text>
          <Text style={styles.date}>
            {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
          </Text>
          <Text style={styles.status}>Status: {request.status.toUpperCase()}</Text>
          {request.notes && <Text style={styles.notes}>{request.notes}</Text>}
        </View>

        {canAccept && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {canComplete && (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Mark as Completed</Text>
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
  itemImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  itemCategory: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemBrand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  itemSize: {
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  notes: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestDetailScreen;


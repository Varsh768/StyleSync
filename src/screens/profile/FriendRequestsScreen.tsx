import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { User, Friendship } from '../../types';

const FriendRequestsScreen: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Array<Friendship & { otherUser: User }>>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    if (!user) return;

    try {
      const requestsQuery = query(
        collection(db, 'friendships'),
        where('userBId', '==', user.id),
        where('status', '==', 'pending')
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsData = await Promise.all(
        requestsSnapshot.docs.map(async (doc) => {
          const friendship = { id: doc.id, ...doc.data() } as Friendship;
          const userDoc = await getDoc(doc(db, 'users', friendship.userAId));
          const otherUser = userDoc.exists()
            ? ({
                id: userDoc.id,
                ...userDoc.data(),
                createdAt: userDoc.data().createdAt?.toDate() || new Date(),
              } as User)
            : null;
          return { ...friendship, otherUser };
        })
      );

      setRequests(requestsData.filter((r) => r.otherUser !== null) as any);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleAccept = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'friendships', requestId), { status: 'accepted' });
      Alert.alert('Success', 'Friend request accepted!');
      loadRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleDecline = async (requestId: string) => {
    Alert.alert('Decline Request', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          try {
            await updateDoc(doc(db, 'friendships', requestId), { status: 'declined' });
            loadRequests();
          } catch (error) {
            console.error('Error declining request:', error);
            Alert.alert('Error', 'Failed to decline request');
          }
        },
      },
    ]);
  };

  const renderRequest = ({ item }: { item: Friendship & { otherUser: User } }) => (
    <View style={styles.requestCard}>
      {item.otherUser.profileImageUrl ? (
        <Image source={{ uri: item.otherUser.profileImageUrl }} style={styles.userImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>{item.otherUser.name.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.otherUser.name}</Text>
        {item.otherUser.school && <Text style={styles.userSchool}>{item.otherUser.school}</Text>}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleDecline(item.id)}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {requests.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pending friend requests</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadRequests} />}
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
    padding: 15,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  userSchool: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  declineButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default FriendRequestsScreen;


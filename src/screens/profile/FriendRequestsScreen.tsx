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
import { useAuth } from '../../context/AuthContext';
import { User, Friendship } from '../../types';
import { Ionicons } from '@expo/vector-icons';

// HARDCODED: Friend request users
const MOCK_FRIEND_REQUEST_USERS: User[] = [
  {
    id: 'user-maria-1',
    name: 'Maria Gonzalez',
    phoneNumber: '+1234567894',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pinimg.com/1200x/f7/2a/1f/f72a1fbb0627cfed9e480a5cb50fefdf.jpg',
    createdAt: new Date('2024-03-01'),
    contactsImported: true,
  },
  {
    id: 'user-khloe-1',
    name: 'Khloe Kacy',
    phoneNumber: '+1234567895',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pinimg.com/1200x/55/44/a5/5544a5bd76014e73708cf5239bcda6ad.jpg',
    createdAt: new Date('2024-03-05'),
    contactsImported: true,
  },
];

// HARDCODED: Initial friend requests
const INITIAL_FRIEND_REQUESTS: Array<Friendship & { otherUser: User }> = [
  {
    id: 'request-maria-1',
    userAId: 'user-maria-1',
    userBId: 'current-user',
    status: 'pending',
    createdAt: new Date('2024-03-10'),
    otherUser: MOCK_FRIEND_REQUEST_USERS[0],
  },
  {
    id: 'request-khloe-1',
    userAId: 'user-khloe-1',
    userBId: 'current-user',
    status: 'pending',
    createdAt: new Date('2024-03-11'),
    otherUser: MOCK_FRIEND_REQUEST_USERS[1],
  },
];

const FriendRequestsScreen: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Array<Friendship & { otherUser: User }>>(INITIAL_FRIEND_REQUESTS);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    // FIREBASE COMMENTED OUT - Using hardcoded data
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleAccept = async (requestId: string) => {
    // FIREBASE COMMENTED OUT - Update local state
    const acceptedRequest = requests.find(r => r.id === requestId);
    if (acceptedRequest) {
      Alert.alert('Success', `${acceptedRequest.otherUser.name} is now your friend!`);
      setRequests(requests.filter(r => r.id !== requestId));
    }
  };

  const handleDecline = async (requestId: string) => {
    const declinedRequest = requests.find(r => r.id === requestId);
    Alert.alert('Decline Request', `Decline friend request from ${declinedRequest?.otherUser.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          // FIREBASE COMMENTED OUT - Update local state
          setRequests(requests.filter(r => r.id !== requestId));
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


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
import { ProfileStackParamList, ClosetStackParamList } from '../../types';
import { collection, query, where, getDocs, or } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { User, Friendship } from '../../types';

type FriendsListScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'FriendsList'>;

interface Props {
  navigation: FriendsListScreenNavigationProp;
}

const FriendsListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriends = async () => {
    if (!user) return;

    try {
      const friendshipsQuery = query(
        collection(db, 'friendships'),
        or(where('userAId', '==', user.id), where('userBId', '==', user.id)),
        where('status', '==', 'accepted')
      );
      const friendshipsSnapshot = await getDocs(friendshipsQuery);
      const friendIds: string[] = [];

      friendshipsSnapshot.docs.forEach((doc) => {
        const data = doc.data() as Friendship;
        if (data.userAId === user.id) {
          friendIds.push(data.userBId);
        } else {
          friendIds.push(data.userAId);
        }
      });

      // Load friend user data
      const friendsData = await Promise.all(
        friendIds.map(async (friendId) => {
          const userDoc = await getDoc(doc(db, 'users', friendId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
              id: userDoc.id,
              ...userData,
              createdAt: userData.createdAt?.toDate() || new Date(),
            } as User;
          }
          return null;
        })
      );

      setFriends(friendsData.filter((f) => f !== null) as User[]);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, [user]);

  const renderFriend = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.friendCard}
      onPress={() => {
        // Navigate to friend's closet via Social tab
        (navigation as any).navigate('Social', {
          screen: 'FriendCloset',
          params: { friendId: item.id, friendName: item.name },
        });
      }}
    >
      {item.profileImageUrl ? (
        <Image source={{ uri: item.profileImageUrl }} style={styles.friendImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>{item.name.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        {item.school && <Text style={styles.friendSchool}>{item.school}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {friends.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No friends yet</Text>
          <Text style={styles.emptySubtext}>Add friends to see their closets!</Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadFriends} />}
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
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  friendImage: {
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
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  friendSchool: {
    fontSize: 14,
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

export default FriendsListScreen;


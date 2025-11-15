import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../types';
import * as Contacts from 'expo-contacts';
import { collection, query, where, getDocs, addDoc, or } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

type AddFriendsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'AddFriends'>;

interface Props {
  navigation: AddFriendsScreenNavigationProp;
}

interface ContactUser extends User {
  phoneNumber: string;
  friendshipStatus?: 'none' | 'pending' | 'accepted';
}

const AddFriendsScreen: React.FC<Props> = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContacts = async () => {
    if (!user) return;

    try {
      // Request contacts permission
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your contacts');
        setLoading(false);
        return;
      }

      // Get contacts
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });

      // Filter contacts with phone numbers and match with app users
      const phoneNumbers = data
        .filter((contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map((contact) => {
          const phone = contact.phoneNumbers![0].number.replace(/\D/g, '');
          return { contact, phone };
        });

      // Get all users from Firestore
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const appUsers = new Map<string, User>();

      usersSnapshot.docs.forEach((doc) => {
        const userData = doc.data();
        const phone = userData.phoneNumber.replace(/\D/g, '');
        appUsers.set(phone, {
          id: doc.id,
          ...userData,
          createdAt: userData.createdAt?.toDate() || new Date(),
        } as User);
      });

      // Match contacts with app users
      const matchedContacts: ContactUser[] = [];
      for (const { contact, phone } of phoneNumbers) {
        const appUser = appUsers.get(phone);
        if (appUser && appUser.id !== user.id) {
          // Check friendship status
          const friendshipsQuery = query(
            collection(db, 'friendships'),
            or(
              where('userAId', '==', user.id),
              where('userBId', '==', user.id)
            )
          );
          const friendshipsSnapshot = await getDocs(friendshipsQuery);
          let friendshipStatus: 'none' | 'pending' | 'accepted' = 'none';

          friendshipsSnapshot.docs.forEach((doc) => {
            const friendship = doc.data();
            if (
              (friendship.userAId === user.id && friendship.userBId === appUser.id) ||
              (friendship.userBId === user.id && friendship.userAId === appUser.id)
            ) {
              friendshipStatus = friendship.status;
            }
          });

          matchedContacts.push({
            ...appUser,
            phoneNumber: appUser.phoneNumber,
            friendshipStatus,
          });
        }
      }

      setContacts(matchedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [user]);

  const handleSendRequest = async (friendId: string) => {
    if (!user) return;

    try {
      // Check if request already exists
      const existingQuery = query(
        collection(db, 'friendships'),
        or(
          where('userAId', '==', user.id),
          where('userBId', '==', user.id)
        )
      );
      const existingSnapshot = await getDocs(existingQuery);

      let alreadyExists = false;
      existingSnapshot.docs.forEach((doc) => {
        const friendship = doc.data();
        if (
          (friendship.userAId === user.id && friendship.userBId === friendId) ||
          (friendship.userBId === user.id && friendship.userAId === friendId)
        ) {
          alreadyExists = true;
        }
      });

      if (alreadyExists) {
        Alert.alert('Already sent', 'Friend request already sent or accepted');
        return;
      }

      await addDoc(collection(db, 'friendships'), {
        userAId: user.id,
        userBId: friendId,
        status: 'pending',
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Friend request sent!');
      loadContacts();
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const renderContact = ({ item }: { item: ContactUser }) => (
    <View style={styles.contactCard}>
      {item.profileImageUrl ? (
        <Image source={{ uri: item.profileImageUrl }} style={styles.contactImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>{item.name.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.school && <Text style={styles.contactSchool}>{item.school}</Text>}
      </View>
      {item.friendshipStatus === 'none' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleSendRequest(item.id)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      )}
      {item.friendshipStatus === 'pending' && (
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      )}
      {item.friendshipStatus === 'accepted' && (
        <View style={styles.friendsBadge}>
          <Text style={styles.friendsText}>Friends</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {contacts.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts found</Text>
          <Text style={styles.emptySubtext}>
            Make sure your contacts have phone numbers and are using the app
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadContacts} />}
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  contactImage: {
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
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  contactSchool: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pendingText: {
    color: '#fff',
    fontWeight: '600',
  },
  friendsBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  friendsText: {
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

export default AddFriendsScreen;


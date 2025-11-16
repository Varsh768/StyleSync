import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SocialStackParamList, User } from '../../types';
import { Ionicons } from '@expo/vector-icons';

type UserProfileScreenNavigationProp = StackNavigationProp<SocialStackParamList, 'UserProfile'>;
type UserProfileScreenRouteProp = RouteProp<SocialStackParamList, 'UserProfile'>;

interface Props {
  navigation: UserProfileScreenNavigationProp;
  route: UserProfileScreenRouteProp;
}

// HARDCODED: User profiles for Tanya, Veronica, and Zeina
const MOCK_USER_PROFILES: { [key: string]: User & { bio?: string; closetItemCount?: number; recentItems?: string[] } } = {
  'user-tanya-1': {
    id: 'user-tanya-1',
    name: 'Tanya Suresh',
    phoneNumber: '+1234567891',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pinimg.com/1200x/06/fa/21/06fa212e8ba50142912f2184a4f33b7d.jpg',
    createdAt: new Date('2024-01-15'),
    contactsImported: true,
    bio: 'Fashion enthusiast 👗 Love sharing my wardrobe with friends!',
    closetItemCount: 24,
     recentItems: [
      'https://i.pinimg.com/1200x/74/31/9b/74319bdabc1f16ee0637b060beb4e136.jpg',
      'https://i.pinimg.com/736x/7f/e1/3e/7fe13eea3872019c31f90351a211a3b4.jpg',
      'https://i.pinimg.com/736x/ee/95/fb/ee95fb8dc967971ea2f2f6f4d1f7e7ba.jpg',
      'https://i.pinimg.com/1200x/16/37/26/16372660152d3110f7052a4cfd51cac8.jpg',
      'https://i.pinimg.com/736x/e4/5f/f7/e45ff70d4e38921d1056ca80a2e470e5.jpg',
      'https://i.pinimg.com/736x/99/1f/28/991f28d124f3d6ee50b0012de756b380.jpg',
    ],
  },
  'user-veronica-1': {
    id: 'user-veronica-1',
    name: 'Veronica Jones',
    phoneNumber: '+1234567892',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pinimg.com/736x/7d/0b/de/7d0bdece3a8a35145987643040aa133e.jpg',
    createdAt: new Date('2024-02-10'),
    contactsImported: true,
    bio: 'Always hunting for the perfect outfit ✨',
    closetItemCount: 18,
     recentItems: [
      'https://i.pinimg.com/736x/cb/31/15/cb3115f78656d74501dde4ae6c396423.jpg',
      'https://i.pinimg.com/736x/c2/fb/c3/c2fbc332f1e556fabdcbed0c4e0924a6.jpg',
      'https://i.pinimg.com/736x/2b/7a/32/2b7a3202925f1a70c176186c0f2b2fa5.jpg',
      'https://i.pinimg.com/736x/94/b9/62/94b962da1ed23fc2cfa3b500d6af9972.jpg',
      'https://i.pinimg.com/736x/f0/b2/82/f0b2827cfc04b329fae54fdd11c2a939.jpg',
      'https://i.pinimg.com/736x/56/55/0c/56550c2d95c23837f2f249268cb774ba.jpg',
    ],
  },
  'user-zeina-1': {
    id: 'user-zeina-1',
    name: 'Zeina Mahmoud',
    phoneNumber: '+1234567893',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pinimg.com/736x/bb/2d/d0/bb2dd04187c87185ab38f837e0670a0b.jpg',
    createdAt: new Date('2024-01-20'),
    contactsImported: true,
    bio: 'Sustainable fashion advocate 🌱 Happy to share!',
    closetItemCount: 31,
    recentItems: [
      'https://i.pinimg.com/736x/18/ac/b0/18acb04f49f6da88f0787e267955a56f.jpg',
      'https://i.pinimg.com/736x/40/3b/43/403b433594634a25e79a3bb3c008f2de.jpg',
      'https://i.pinimg.com/736x/ca/05/84/ca0584a1e875e02f2d3e0ef91d6f5749.jpg',
      'https://i.pinimg.com/736x/4f/46/ce/4f46cea5decba78f63238b57bf9b7620.jpg',
      'https://i.pinimg.com/736x/68/2e/76/682e767eff0bd00f097804ea086da384.jpg',
      'https://i.pinimg.com/1200x/0c/26/e9/0c26e92d3c4ee05861d0241579ba6936.jpg',
    ],
  },
};

const UserProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const userProfile = MOCK_USER_PROFILES[userId];

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {userProfile.profileImageUrl ? (
          <Image source={{ uri: userProfile.profileImageUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={60} color="#ccc" />
          </View>
        )}
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.school}>{userProfile.school}</Text>
        {userProfile.bio && <Text style={styles.bio}>{userProfile.bio}</Text>}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.closetItemCount || 0}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            // Navigate to friend's closet within the Social stack
            navigation.navigate('FriendCloset', {
              friendId: userProfile.id,
              friendName: userProfile.name,
            });
          }}
        >
          <Ionicons name="shirt-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>View Closet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            navigation.navigate('Messages', {
              userId: userProfile.id,
              userName: userProfile.name,
            });
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{userProfile.school}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={styles.infoText}>
            Joined {userProfile.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Items</Text>
        <View style={styles.placeholderGrid}>
          {userProfile.recentItems && userProfile.recentItems.length > 0 ? (
            userProfile.recentItems.map((imageUrl, index) => (
              <TouchableOpacity key={index} style={styles.itemImageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.itemImage} />
              </TouchableOpacity>
            ))
          ) : (
            [1, 2, 3, 4, 5, 6].map((item) => (
              <View key={item} style={styles.itemPlaceholder}>
                <Ionicons name="image-outline" size={30} color="#ccc" />
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
    color: '#000',
  },
  school: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
  },
  placeholderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemPlaceholder: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemImageContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default UserProfileScreen;

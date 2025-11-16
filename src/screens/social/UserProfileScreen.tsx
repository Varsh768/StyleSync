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

// HARDCODED: User profiles for Tanya, Veronica, and Sarah
const MOCK_USER_PROFILES: { [key: string]: User & { bio?: string; closetItemCount?: number; recentItems?: string[] } } = {
  'user-tanya-1': {
    id: 'user-tanya-1',
    name: 'Tanya',
    phoneNumber: '+1234567891',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pravatar.cc/300?img=1',
    createdAt: new Date('2024-01-15'),
    contactsImported: true,
    bio: 'Fashion enthusiast 👗 Love sharing my wardrobe with friends!',
    closetItemCount: 24,
    recentItems: [
      'https://i.pinimg.com/1200x/74/31/9b/74319bdabc1f16ee0637b060beb4e136.jpg',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400',
    ],
  },
  'user-veronica-1': {
    id: 'user-veronica-1',
    name: 'Veronica',
    phoneNumber: '+1234567892',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pravatar.cc/300?img=5',
    createdAt: new Date('2024-02-10'),
    contactsImported: true,
    bio: 'Always hunting for the perfect outfit ✨',
    closetItemCount: 18,
    recentItems: [
      'https://i.pinimg.com/736x/cb/31/15/cb3115f78656d74501dde4ae6c396423.jpg',
      'https://i.pinimg.com/736x/c2/fb/c3/c2fbc332f1e556fabdcbed0c4e0924a6.jpg',
      'https://i.pinimg.com/736x/2b/7a/32/2b7a3202925f1a70c176186c0f2b2fa5.jpg',
      'https://i.pinimg.com/736x/94/b9/62/94b962da1ed23fc2cfa3b500d6af9972.jpg',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400',
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=400',
    ],
  },
  'user-sarah-1': {
    id: 'user-sarah-1',
    name: 'Sarah',
    phoneNumber: '+1234567893',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pravatar.cc/300?img=9',
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
        <TouchableOpacity style={styles.secondaryButton}>
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

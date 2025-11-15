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

// HARDCODED: User profiles for Tanvi, Varsha, and Suha
const MOCK_USER_PROFILES: { [key: string]: User & { bio?: string; closetItemCount?: number } } = {
  'user-tanvi-1': {
    id: 'user-tanvi-1',
    name: 'Tanvi',
    phoneNumber: '+1234567891',
    school: 'UW-Madison',
    profileImageUrl: '',
    createdAt: new Date('2024-01-15'),
    contactsImported: true,
    bio: 'Fashion enthusiast 👗 Love sharing my wardrobe with friends!',
    closetItemCount: 24,
  },
  'user-varsha-1': {
    id: 'user-varsha-1',
    name: 'Varsha',
    phoneNumber: '+1234567892',
    school: 'UW-Madison',
    profileImageUrl: '',
    createdAt: new Date('2024-02-10'),
    contactsImported: true,
    bio: 'Always hunting for the perfect outfit ✨',
    closetItemCount: 18,
  },
  'user-suha-1': {
    id: 'user-suha-1',
    name: 'Suha',
    phoneNumber: '+1234567893',
    school: 'UW-Madison',
    profileImageUrl: '',
    createdAt: new Date('2024-01-20'),
    contactsImported: true,
    bio: 'Sustainable fashion advocate 🌱 Happy to share!',
    closetItemCount: 31,
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
        <TouchableOpacity style={styles.primaryButton}>
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
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={styles.itemPlaceholder}>
              <Ionicons name="image-outline" size={30} color="#ccc" />
            </View>
          ))}
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
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default UserProfileScreen;

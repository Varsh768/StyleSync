import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Linking, Alert, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SocialStackParamList, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Community, getCommunityById } from '../../data/communities';
import { Ionicons } from '@expo/vector-icons';

type SocialHomeScreenNavigationProp = StackNavigationProp<SocialStackParamList, 'SocialHome'>;

interface Props {
  navigation: SocialHomeScreenNavigationProp;
}

interface GroupMember {
  id: string;
  name: string;
  profileImageUrl?: string;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  members: GroupMember[];
  createdAt: Date;
}

// HARDCODED: Besties group with Tanya, Veronica, and Sarah
const MOCK_GROUPS: Group[] = [
  {
    id: 'group-besties-1',
    name: 'Besties',
    description: 'Your closest friends',
    memberCount: 3,
    members: [
      { id: 'user-tanya-1', name: 'Tanya', profileImageUrl: '' },
      { id: 'user-veronica-1', name: 'Veronica', profileImageUrl: '' },
      { id: 'user-sarah-1', name: 'Sarah', profileImageUrl: '' },
    ],
    createdAt: new Date(),
  },
];

// HARDCODED: User's joined communities
const JOINED_COMMUNITY_IDS = ['community-uw-madison'];

// HARDCODED: Friends (from Besties group) - alphabetized
const MOCK_FRIENDS: User[] = [
  {
    id: 'user-sarah-1',
    name: 'Sarah',
    phoneNumber: '+1234567893',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pravatar.cc/300?img=9',
    createdAt: new Date('2024-01-20'),
    contactsImported: true,
  },
  {
    id: 'user-tanya-1',
    name: 'Tanya',
    phoneNumber: '+1234567891',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pravatar.cc/300?img=1',
    createdAt: new Date('2024-01-15'),
    contactsImported: true,
  },
  {
    id: 'user-veronica-1',
    name: 'Veronica',
    phoneNumber: '+1234567892',
    school: 'UW-Madison',
    profileImageUrl: 'https://i.pravatar.cc/300?img=5',
    createdAt: new Date('2024-02-10'),
    contactsImported: true,
  },
];

const SocialHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'groups' | 'communities'>('friends');
  const [groups, setGroups] = useState<Group[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    // Load hardcoded groups
    setGroups(MOCK_GROUPS);

    // Load hardcoded communities
    const joinedCommunities = JOINED_COMMUNITY_IDS
      .map(id => getCommunityById(id))
      .filter((c): c is Community => c !== undefined);
    setCommunities(joinedCommunities);

    // Load hardcoded friends (already alphabetized)
    setFriends(MOCK_FRIENDS);
  }, []);

  const handleInviteToGroup = async (groupName: string) => {
    const message = `Hey! 👋 I'm using StyleSync to share my closet with friends. Want to join my "${groupName}" group? We swap outfits, save money, and help the planet! 👗✨`;
    const smsUrl = `sms:&body=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert('Unable to open Messages', 'Please check your device settings.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open Messages app.');
    }
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate('GroupDetail', { groupId: item.id, groupName: item.name })}
    >
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        {item.description && <Text style={styles.groupDescription}>{item.description}</Text>}
        <Text style={styles.memberCount}>{item.memberCount} members</Text>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleInviteToGroup(item.name);
          }}
        >
          <Ionicons name="person-add-outline" size={16} color="#007AFF" />
          <Text style={styles.inviteButtonText}>Invite Member</Text>
        </TouchableOpacity>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  const renderFriend = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.friendCard}
      onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
    >
      {item.profileImageUrl ? (
        <Image source={{ uri: item.profileImageUrl }} style={styles.friendImage} />
      ) : (
        <View style={styles.friendPlaceholder}>
          <Ionicons name="person" size={32} color="#ccc" />
        </View>
      )}
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendSchool}>{item.school}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  const renderCommunity = ({ item }: { item: Community }) => (
    <TouchableOpacity style={styles.communityCard}>
      <View style={styles.communityIcon}>
        <Ionicons name="school" size={32} color="#007AFF" />
      </View>
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>{item.shortName}</Text>
        <Text style={styles.communityFullName}>{item.name}</Text>
        <Text style={styles.communityLocation}>
          <Ionicons name="location-outline" size={14} color="#666" /> {item.location}
        </Text>
        <Text style={styles.communityMemberCount}>
          <Ionicons name="people-outline" size={14} color="#999" /> {item.memberCount.toLocaleString()} members
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'communities' && styles.activeTab]}
          onPress={() => setActiveTab('communities')}
        >
          <Text style={[styles.tabText, activeTab === 'communities' && styles.activeTabText]}>
            Communities
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'friends' && (
        <View style={styles.fullHeight}>
          <FlatList
            data={friends}
            renderItem={renderFriend}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.groupsList}
            ListHeaderComponent={
              <View>
                <TouchableOpacity
                  style={[styles.addButton, styles.addFriendsButton]}
                  onPress={() => navigation.navigate('AddFriends')}
                >
                  <Text style={styles.addButtonText}>+ Add Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FriendRequests')}>
                  <View style={[styles.sectionCard, styles.friendRequestsCard]}>
                    <View style={styles.friendRequestsHeader}>
                      <Ionicons name="person-add" size={24} color="#FF3B30" />
                      <View style={styles.friendRequestsBadge}>
                        <Text style={styles.friendRequestsBadgeText}>2</Text>
                      </View>
                    </View>
                    <Text style={styles.sectionTitle}>Friend Requests</Text>
                    <Text style={styles.sectionSubtitle}>You have 2 pending requests</Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No friends yet</Text>
                <Text style={styles.emptySubtext}>Add friends to get started!</Text>
              </View>
            }
          />
        </View>
      )}

      {activeTab === 'groups' && (
        <View style={styles.fullHeight}>
          <FlatList
            data={groups}
            renderItem={renderGroup}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.groupsList}
            ListHeaderComponent={
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate('CreateGroup')}
                >
                  <Text style={styles.addButtonText}>+ Create Group</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => navigation.navigate('JoinGroup')}
                >
                  <Text style={styles.joinButtonText}>+ Join Group</Text>
                </TouchableOpacity>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No groups yet</Text>
                <Text style={styles.emptySubtext}>Create or join a group to get started!</Text>
              </View>
            }
          />
        </View>
      )}

      {activeTab === 'communities' && (
        <View style={styles.fullHeight}>
          <FlatList
            data={communities}
            renderItem={renderCommunity}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.groupsList}
            ListHeaderComponent={
              <TouchableOpacity
                style={[styles.addButton, styles.communityAddButton]}
                onPress={() => navigation.navigate('JoinCommunity')}
              >
                <Text style={styles.addButtonText}>+ Join Community</Text>
              </TouchableOpacity>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No communities yet</Text>
                <Text style={styles.emptySubtext}>Join a community to connect with others!</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  fullHeight: {
    flex: 1,
    paddingHorizontal: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addFriendsButton: {
    marginTop: 15,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  friendRequestsCard: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#FFE0E0',
  },
  friendRequestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  friendRequestsBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  friendRequestsBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  groupsList: {
    paddingBottom: 20,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  memberCount: {
    fontSize: 12,
    color: '#999',
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    alignItems: 'center',
  },
  membersLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    marginRight: 5,
  },
  memberName: {
    fontSize: 13,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  memberSeparator: {
    fontSize: 13,
    color: '#333',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignSelf: 'flex-start',
    gap: 6,
  },
  inviteButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  communityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    color: '#000',
  },
  communityFullName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  communityLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  communityMemberCount: {
    fontSize: 12,
    color: '#999',
  },
  communityAddButton: {
    marginTop: 15,
    marginBottom: 20,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  friendImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  friendPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    color: '#000',
  },
  friendSchool: {
    fontSize: 13,
    color: '#666',
  },
});

export default SocialHomeScreen;


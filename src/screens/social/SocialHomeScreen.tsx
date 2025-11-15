import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SocialStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';

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

// HARDCODED: Besties group with Tanvi, Varsha, and Suha
const MOCK_GROUPS: Group[] = [
  {
    id: 'group-besties-1',
    name: 'Besties',
    description: 'Your closest friends',
    memberCount: 3,
    members: [
      { id: 'user-tanvi-1', name: 'Tanvi', profileImageUrl: '' },
      { id: 'user-varsha-1', name: 'Varsha', profileImageUrl: '' },
      { id: 'user-suha-1', name: 'Suha', profileImageUrl: '' },
    ],
    createdAt: new Date(),
  },
];

const SocialHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'groups' | 'communities'>('friends');
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Load hardcoded groups
    setGroups(MOCK_GROUPS);
  }, []);

  const renderGroup = ({ item }: { item: Group }) => (
    <View style={styles.groupCard}>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        {item.description && <Text style={styles.groupDescription}>{item.description}</Text>}
        <Text style={styles.memberCount}>{item.memberCount} members</Text>
        {item.members && item.members.length > 0 && (
          <View style={styles.membersContainer}>
            <Text style={styles.membersLabel}>Members:</Text>
            {item.members.map((member, index) => (
              <React.Fragment key={member.id}>
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: member.id })}>
                  <Text style={styles.memberName}>{member.name}</Text>
                </TouchableOpacity>
                {index < item.members.length - 1 && <Text style={styles.memberSeparator}>, </Text>}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
    </View>
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
        <ScrollView style={styles.content}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddFriends')}
          >
            <Text style={styles.addButtonText}>+ Add Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>My Friends</Text>
              <Text style={styles.sectionSubtitle}>View all your friends</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
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
        <ScrollView style={styles.content}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('JoinCommunity')}
          >
            <Text style={styles.addButtonText}>+ Join Community</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Communities')}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>My Communities</Text>
              <Text style={styles.sectionSubtitle}>View all your communities</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
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
});

export default SocialHomeScreen;


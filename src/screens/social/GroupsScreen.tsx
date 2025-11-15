import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SocialStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';

type GroupsScreenNavigationProp = StackNavigationProp<SocialStackParamList, 'Groups'>;

interface Props {
  navigation: GroupsScreenNavigationProp;
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

const GroupsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
    // Mock: Return hardcoded Besties group
    setGroups(MOCK_GROUPS);
    setLoading(false);
  };

  useEffect(() => {
    loadGroups();
  }, [user]);

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
      {groups.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No groups yet</Text>
          <Text style={styles.emptySubtext}>Create or join a group to get started!</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateGroup')}
            >
              <Text style={styles.addButtonText}>Create Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => navigation.navigate('JoinGroup')}
            >
              <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadGroups} />}
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
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GroupsScreen;


import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SocialStackParamList, User } from '../../types';
import { Ionicons } from '@expo/vector-icons';

type GroupDetailScreenNavigationProp = StackNavigationProp<SocialStackParamList, 'GroupDetail'>;
type GroupDetailScreenRouteProp = RouteProp<SocialStackParamList, 'GroupDetail'>;

interface Props {
  navigation: GroupDetailScreenNavigationProp;
  route: GroupDetailScreenRouteProp;
}

// HARDCODED: Besties group members (alphabetized)
const GROUP_MEMBERS: { [key: string]: User[] } = {
  'group-besties-1': [
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
  ],
};

const GroupDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { groupId, groupName } = route.params;
  const members = GROUP_MEMBERS[groupId] || [];

  const renderMember = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
    >
      {item.profileImageUrl ? (
        <Image source={{ uri: item.profileImageUrl }} style={styles.memberImage} />
      ) : (
        <View style={styles.memberPlaceholder}>
          <Ionicons name="person" size={32} color="#ccc" />
        </View>
      )}
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberSchool}>{item.school}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No members yet</Text>
            <Text style={styles.emptySubtext}>Invite friends to join this group!</Text>
          </View>
        }
      />
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
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  memberImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  memberPlaceholder: {
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
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    color: '#000',
  },
  memberSchool: {
    fontSize: 13,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default GroupDetailScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SocialStackParamList } from '../../types';

type SocialHomeScreenNavigationProp = StackNavigationProp<SocialStackParamList, 'SocialHome'>;

interface Props {
  navigation: SocialHomeScreenNavigationProp;
}

const SocialHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'groups' | 'communities'>('friends');

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

      <ScrollView style={styles.content}>
        {activeTab === 'friends' && (
          <View>
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
          </View>
        )}

        {activeTab === 'groups' && (
          <View>
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
            <TouchableOpacity onPress={() => navigation.navigate('Groups')}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>My Groups</Text>
                <Text style={styles.sectionSubtitle}>View all your groups</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'communities' && (
          <View>
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
          </View>
        )}
      </ScrollView>
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
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
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
});

export default SocialHomeScreen;


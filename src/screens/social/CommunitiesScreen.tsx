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
import { Community, getCommunityById } from '../../data/communities';
import { Ionicons } from '@expo/vector-icons';

type CommunitiesScreenNavigationProp = StackNavigationProp<SocialStackParamList, 'Communities'>;

interface Props {
  navigation: CommunitiesScreenNavigationProp;
}

// HARDCODED: User's joined communities (for demo purposes)
const JOINED_COMMUNITY_IDS = ['community-uw-madison', 'community-uiuc'];

const CommunitiesScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCommunities = async () => {
    // FIREBASE COMMENTED OUT - Load hardcoded joined communities
    const joinedCommunities = JOINED_COMMUNITY_IDS
      .map(id => getCommunityById(id))
      .filter((c): c is Community => c !== undefined);

    setCommunities(joinedCommunities);
    setLoading(false);
  };

  useEffect(() => {
    loadCommunities();
  }, [user]);

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
        <Text style={styles.memberCount}>
          <Ionicons name="people-outline" size={14} color="#999" /> {item.memberCount.toLocaleString()} members
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {communities.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No communities yet</Text>
          <Text style={styles.emptySubtext}>Join a community to connect with others!</Text>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => navigation.navigate('JoinCommunity')}
          >
            <Text style={styles.joinButtonText}>Join Community</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={communities}
          renderItem={renderCommunity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCommunities} />}
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
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
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
  communityInfo: {
    flex: 1,
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
  memberCount: {
    fontSize: 12,
    color: '#999',
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
  joinButton: {
    backgroundColor: '#007AFF',
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

export default CommunitiesScreen;


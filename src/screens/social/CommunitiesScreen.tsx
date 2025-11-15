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

type CommunitiesScreenNavigationProp = StackNavigationProp<SocialStackParamList, 'Communities'>;

interface Props {
  navigation: CommunitiesScreenNavigationProp;
}

interface Community {
  id: string;
  name: string;
  description?: string;
  location?: string;
  memberCount: number;
  createdAt: Date;
}

const CommunitiesScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCommunities = async () => {
    // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
    // Mock: Return empty array for now
    setCommunities([]);
    setLoading(false);
  };

  useEffect(() => {
    loadCommunities();
  }, [user]);

  const renderCommunity = ({ item }: { item: Community }) => (
    <TouchableOpacity style={styles.communityCard}>
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>{item.name}</Text>
        {item.location && <Text style={styles.communityLocation}>{item.location}</Text>}
        {item.description && <Text style={styles.communityDescription}>{item.description}</Text>}
        <Text style={styles.memberCount}>{item.memberCount} members</Text>
      </View>
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
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  communityLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
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


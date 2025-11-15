import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SocialStackParamList } from '../../types';
import { Community, searchCommunities, getTopCommunities } from '../../data/communities';
import { Ionicons } from '@expo/vector-icons';

type JoinCommunityScreenNavigationProp = StackNavigationProp<SocialStackParamList, 'JoinCommunity'>;

interface Props {
  navigation: JoinCommunityScreenNavigationProp;
}

const JoinCommunityScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [showingTopCommunities, setShowingTopCommunities] = useState(true);

  useEffect(() => {
    // Show top communities initially
    setFilteredCommunities(getTopCommunities());
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim()) {
      const results = searchCommunities(query);
      setFilteredCommunities(results);
      setShowingTopCommunities(false);
    } else {
      setFilteredCommunities(getTopCommunities());
      setShowingTopCommunities(true);
    }
  };

  const handleJoinCommunity = (community: Community) => {
    Alert.alert(
      'Join Community',
      `Do you want to join ${community.shortName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: () => {
            Alert.alert('Success', `You've joined ${community.shortName}!`);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderCommunity = ({ item }: { item: Community }) => (
    <TouchableOpacity
      style={styles.communityCard}
      onPress={() => handleJoinCommunity(item)}
    >
      <View style={styles.communityIcon}>
        <Ionicons name="school-outline" size={32} color="#007AFF" />
      </View>
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>{item.shortName}</Text>
        <Text style={styles.communityFullName}>{item.name}</Text>
        <Text style={styles.communityLocation}>
          <Ionicons name="location-outline" size={14} color="#666" /> {item.location}
        </Text>
        <Text style={styles.communityDescription}>{item.description}</Text>
        <Text style={styles.memberCount}>
          <Ionicons name="people-outline" size={14} color="#999" /> {item.memberCount.toLocaleString()} members
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search by name or location (e.g., UW-Madison)"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        {showingTopCommunities ? 'Top Communities' : `${filteredCommunities.length} Results`}
      </Text>

      <FlatList
        data={filteredCommunities}
        renderItem={renderCommunity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No communities found</Text>
            <Text style={styles.emptySubtext}>Try searching with different keywords</Text>
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
  searchSection: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 10,
    color: '#000',
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
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
  communityDescription: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  memberCount: {
    fontSize: 12,
    color: '#999',
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

export default JoinCommunityScreen;


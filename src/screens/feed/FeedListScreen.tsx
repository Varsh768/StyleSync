import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FeedStackParamList } from '../../types';
// FIREBASE COMMENTED OUT FOR TESTING
// import { collection, query, where, getDocs, orderBy, or } from 'firebase/firestore';
// import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Post } from '../../types';
import { getPosts } from '../../services/localStorage';

type FeedListScreenNavigationProp = StackNavigationProp<FeedStackParamList, 'FeedList'>;

interface Props {
  navigation: FeedListScreenNavigationProp;
}

interface PostWithAuthor extends Post {
  authorName?: string;
  isSponsored?: boolean;
  brandName?: string;
  productName?: string;
  productSize?: string;
  sponsorLink?: string;
  sustainabilityStats?: {
    waterSaved?: string;
    co2Reduced?: string;
    recycledMaterials?: string;
  };
}

const FeedListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    // FIREBASE COMMENTED OUT - HARDCODED DATA FOR TESTING
    try {
      // Load user-created posts from local storage
      const userPosts = await getPosts();
      
      // Hardcoded posts from friends Samantha, Gwen, and Hanna
      const hardcodedPosts: PostWithAuthor[] = [
        {
          id: 'post-1',
          authorId: 'sarah-id',
          authorName: 'Samantha Antonopoulos',
          imageUrls: [
            'https://i.pinimg.com/736x/7e/04/74/7e0474921319d865bbea6f1c9fd4e3d3.jpg',
          ],
          caption: 'This is a cute dinner outfit 🍽️✨',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: 'post-2',
          authorId: 'veronica-id',
          authorName: 'Gwen Smith',
          imageUrls: [
            'https://i.pinimg.com/736x/08/bf/08/08bf084a3d8e3ac166f39212f70383a4.jpg',
          ],
          caption: 'This is a fall outfit 🍂🍁',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
        {
          id: 'sponsored-post-1',
          authorId: 'reformation-brand',
          authorName: 'Reformation',
          isSponsored: true,
          brandName: 'Reformation',
          productName: 'Reformation Dress',
          productSize: 'Medium',
          sponsorLink: 'https://www.reformation.com', // User will fill this in
          imageUrls: [
            'https://i.pinimg.com/736x/c5/f0/85/c5f08545e4b4c8e62c4f5b8b0e5e4f3e.jpg',
          ],
          caption: 'Sustainable style meets elegance 🌿',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          sustainabilityStats: {
            waterSaved: '3,000 gallons',
            co2Reduced: '12 lbs',
            recycledMaterials: '60% recycled fabric',
          },
        },
        {
          id: 'post-3',
          authorId: 'tanya-id',
          authorName: 'Hanna Rossi',
          imageUrls: [
            'https://i.pinimg.com/736x/37/5b/0c/375b0c6ba3130fd0ea8f1ed6543970de.jpg',
          ],
          caption: 'This is a workout outfit 💪🏋️',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          id: 'post-4',
          authorId: 'sarah-id',
          authorName: 'Samantha Antonopoulos',
          imageUrls: [
            'https://i.pinimg.com/736x/d8/a4/fb/d8a4fb60e7f7514d60e560015d06f520.jpg',
          ],
          caption: 'This is a comfy outfit 😌💕',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          id: 'post-5',
          authorId: 'veronica-id',
          authorName: 'Gwen Smith',
          imageUrls: [
            'https://i.pinimg.com/736x/c7/5e/0b/c75e0bdc64e0a4e981a09e009ebfb0c4.jpg',
          ],
          caption: 'Casual but cute 🥰',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
          id: 'sponsored-post-2',
          authorId: 'girlfriend-collective-brand',
          authorName: 'Girlfriend Collective',
          isSponsored: true,
          brandName: 'Girlfriend Collective',
          productName: 'High-Rise Leggings',
          productSize: 'Small',
          sponsorLink: 'https://www.girlfriend.com', // User will fill this in
          imageUrls: [
            'https://i.pinimg.com/736x/ea/3a/b9/ea3ab9c8e0e8c8f4f5c5e5f5e5f5e5f5.jpg',
          ],
          caption: 'Made from recycled water bottles 💧♻️',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000), // 3.5 days ago
          sustainabilityStats: {
            waterSaved: '1,200 gallons',
            co2Reduced: '8 lbs',
            recycledMaterials: '79% recycled plastic bottles',
          },
        },
        {
          id: 'post-6',
          authorId: 'tanya-id',
          authorName: 'Hanna Rossi',
          imageUrls: [
            'https://i.pinimg.com/736x/29/e3/88/29e3881dcf77d662087b241169023346.jpg',
          ],
          caption: 'Running outfit 🏃‍♀️',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        },
        {
          id: 'post-7',
          authorId: 'sarah-id',
          authorName: 'Samantha Antonopoulos',
          imageUrls: [
            'https://i.pinimg.com/1200x/d2/c7/b8/d2c7b871788cb23bfa7677a1c27a379e.jpg',
          ],
          caption: 'Trench coat for colder days 🧥❄️',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
        {
          id: 'post-8',
          authorId: 'veronica-id',
          authorName: 'Gwen Smith',
          imageUrls: [
            'https://i.pinimg.com/736x/82/1c/55/821c5528b2233106e228a214d5339ac3.jpg',
          ],
          caption: 'Love this look! ✨',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        },
      ];

      // Convert user posts from storage format to PostWithAuthor format
      const convertedUserPosts: PostWithAuthor[] = userPosts.map((storedPost) => ({
        id: storedPost.id,
        authorId: storedPost.authorId,
        authorName: storedPost.authorName,
        imageUrls: storedPost.imageUrls,
        caption: storedPost.caption,
        taggedItemIds: storedPost.taggedItemIds,
        visibility: storedPost.visibility,
        createdAt: new Date(storedPost.createdAt),
      }));

      // Combine user posts with hardcoded posts
      const allPosts = [...convertedUserPosts, ...hardcodedPosts];

      // Sort by createdAt (newest first)
      allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  // Reload posts when screen is focused (e.g., after creating a new post)
  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [user])
  );

  const handleSponsoredPostPress = async (link?: string) => {
    if (!link) {
      Alert.alert('No Link', 'This sponsored post does not have a link set up yet.');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(link);
      if (canOpen) {
        await Linking.openURL(link);
      } else {
        Alert.alert('Cannot Open Link', 'Unable to open this link.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link.');
    }
  };

  const renderPost = ({ item }: { item: PostWithAuthor }) => {
    if (item.isSponsored) {
      return (
        <TouchableOpacity
          style={[styles.postCard, styles.sponsoredCard]}
          onPress={() => handleSponsoredPostPress(item.sponsorLink)}
        >
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredBadgeText}>Sponsored</Text>
          </View>
          <View style={styles.postHeader}>
            <View style={styles.authorInfo}>
              <View style={[styles.avatar, styles.brandAvatar]}>
                <Ionicons name="leaf" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.authorName}>{item.brandName || 'Brand'}</Text>
                <Text style={styles.productInfo}>
                  {item.productName}
                </Text>
              </View>
            </View>
          </View>
          {item.imageUrls && item.imageUrls.length > 0 && (
            <Image source={{ uri: item.imageUrls[0] }} style={styles.postImage} />
          )}
          {item.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.caption}>{item.caption}</Text>
            </View>
          )}
          {item.sustainabilityStats && (
            <View style={styles.sustainabilityContainer}>
              <View style={styles.sustainabilityHeader}>
                <Ionicons name="leaf-outline" size={16} color="#34C759" />
                <Text style={styles.sustainabilityTitle}>Sustainability Impact</Text>
              </View>
              <View style={styles.statsGrid}>
                {item.sustainabilityStats.waterSaved && (
                  <View style={styles.statItem}>
                    <Ionicons name="water-outline" size={14} color="#007AFF" />
                    <Text style={styles.statText}>{item.sustainabilityStats.waterSaved}</Text>
                  </View>
                )}
                {item.sustainabilityStats.co2Reduced && (
                  <View style={styles.statItem}>
                    <Ionicons name="cloud-outline" size={14} color="#FF9500" />
                    <Text style={styles.statText}>{item.sustainabilityStats.co2Reduced} CO₂</Text>
                  </View>
                )}
                {item.sustainabilityStats.recycledMaterials && (
                  <View style={styles.statItem}>
                    <Ionicons name="repeat-outline" size={14} color="#34C759" />
                    <Text style={styles.statText}>{item.sustainabilityStats.recycledMaterials}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          <View style={styles.shopNowContainer}>
            <Ionicons name="arrow-forward-circle-outline" size={18} color="#007AFF" />
            <Text style={styles.shopNowText}>Tap to shop now</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => navigation.navigate('FeedPostItems', { postId: item.id, authorName: item.authorName })}
      >
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.authorName ? item.authorName.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <Text style={styles.authorName}>{item.authorName || 'Unknown'}</Text>
          </View>
          <Text style={styles.timestamp}>
            {getTimeAgo(item.createdAt)}
          </Text>
        </View>
        {item.imageUrls && item.imageUrls.length > 0 && (
          <Image source={{ uri: item.imageUrls[0] }} style={styles.postImage} />
        )}
        {item.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.authorNameCaption}>{item.authorName || 'Unknown'}</Text>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <View style={styles.container}>
      {posts.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts yet</Text>
          <Text style={styles.emptySubtext}>Be the first to share an outfit!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPosts} />}
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
    padding: 10,
  },
  postCard: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  captionContainer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  authorNameCaption: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  caption: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
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
  },
  // Sponsored post styles
  sponsoredCard: {
    borderColor: '#34C759',
    borderWidth: 2,
    backgroundColor: '#f9fff9',
  },
  sponsoredBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    margin: 8,
    borderRadius: 4,
  },
  sponsoredBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  brandAvatar: {
    backgroundColor: '#34C759',
  },
  productInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sustainabilityContainer: {
    backgroundColor: '#f0fff4',
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4f4dd',
  },
  sustainabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sustainabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 6,
  },
  statsGrid: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 8,
  },
  shopNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  shopNowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 6,
  },
});

export default FeedListScreen;


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
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
      
      // Hardcoded posts from friends Sarah, Veronica, and Tanya
      const hardcodedPosts: PostWithAuthor[] = [
        {
          id: 'post-1',
          authorId: 'sarah-id',
          authorName: 'Sarah',
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
          authorName: 'Veronica',
          imageUrls: [
            'https://i.pinimg.com/736x/08/bf/08/08bf084a3d8e3ac166f39212f70383a4.jpg',
          ],
          caption: 'This is a fall outfit 🍂🍁',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
        {
          id: 'post-3',
          authorId: 'tanya-id',
          authorName: 'Tanya',
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
          authorName: 'Sarah',
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
          authorName: 'Veronica',
          imageUrls: [
            'https://i.pinimg.com/736x/c7/5e/0b/c75e0bdc64e0a4e981a09e009ebfb0c4.jpg',
          ],
          caption: 'Casual but cute 🥰',
          visibility: 'friends',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
          id: 'post-6',
          authorId: 'tanya-id',
          authorName: 'Tanya',
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
          authorName: 'Sarah',
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
          authorName: 'Veronica',
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

  const renderPost = ({ item }: { item: PostWithAuthor }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
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
});

export default FeedListScreen;


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
import { FeedStackParamList } from '../../types';
import { collection, query, where, getDocs, orderBy, or } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Post } from '../../types';

type FeedListScreenNavigationProp = StackNavigationProp<FeedStackParamList, 'FeedList'>;

interface Props {
  navigation: FeedListScreenNavigationProp;
}

const FeedListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    if (!user) return;

    try {
      // Get user's friends
      const { doc, getDocs, collection: col } = await import('firebase/firestore');
      const friendshipsQuery = query(
        col(db, 'friendships'),
        or(where('userAId', '==', user.id), where('userBId', '==', user.id)),
        where('status', '==', 'accepted')
      );
      const friendshipsSnapshot = await getDocs(friendshipsQuery);
      const friendIds = new Set<string>();
      friendIds.add(user.id); // Include own posts

      friendshipsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userAId === user.id) {
          friendIds.add(data.userBId);
        } else {
          friendIds.add(data.userAId);
        }
      });

      // Get posts from friends (limit to 10 friends at a time due to Firestore 'in' limit)
      const friendIdsArray = Array.from(friendIds).slice(0, 10);
      const postsQuery = query(
        col(db, 'posts'),
        where('authorId', 'in', friendIdsArray),
        orderBy('createdAt', 'desc')
      );
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Post[];
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      {item.imageUrls && item.imageUrls.length > 0 && (
        <Image source={{ uri: item.imageUrls[0] }} style={styles.postImage} />
      )}
      {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Text style={styles.addButtonText}>+ Post</Text>
        </TouchableOpacity>
      </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  postCard: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  caption: {
    padding: 15,
    fontSize: 16,
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


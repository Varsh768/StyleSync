import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { FeedStackParamList } from '../../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Post } from '../../types';

type PostDetailScreenNavigationProp = StackNavigationProp<FeedStackParamList, 'PostDetail'>;
type PostDetailScreenRouteProp = RouteProp<FeedStackParamList, 'PostDetail'>;

interface Props {
  navigation: PostDetailScreenNavigationProp;
  route: PostDetailScreenRouteProp;
}

const PostDetailScreen: React.FC<Props> = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        const data = postDoc.data();
        setPost({
          id: postDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Post);
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !post) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {post.imageUrls && post.imageUrls.length > 0 && (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {post.imageUrls.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </ScrollView>
      )}
      {post.caption && (
        <View style={styles.content}>
          <Text style={styles.caption}>{post.caption}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  caption: {
    fontSize: 16,
  },
});

export default PostDetailScreen;


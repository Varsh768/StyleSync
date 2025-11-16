import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FeedStackParamList } from '../../types';
// FIREBASE COMMENTED OUT FOR TESTING
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { savePost } from '../../services/localStorage';

type CreatePostScreenNavigationProp = StackNavigationProp<FeedStackParamList, 'CreatePost'>;

interface Props {
  navigation: CreatePostScreenNavigationProp;
}

const CreatePostScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please grant permission to access your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
  // const uploadImage = async (uri: string, postId: string, index: number): Promise<string> => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();
  //   const imageRef = ref(storage, `posts/${postId}/${index}`);
  //   await uploadBytes(imageRef, blob);
  //   return await getDownloadURL(imageRef);
  // };

  const handlePost = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    setLoading(true);
    try {
      // FIREBASE COMMENTED OUT - HARDCODED IMPLEMENTATION
      // Save post to local storage (hardcoded, no Firebase)
      await savePost({
        authorId: user.id,
        authorName: user.name, // Use user's name from auth context
        imageUrls: images, // Store local image URIs directly
        caption: caption.trim() || undefined,
        taggedItemIds: [],
        visibility: 'friends',
      });

      Alert.alert('Success', 'Post created!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Photos *</Text>
        <View style={styles.imageContainer}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Text style={styles.cameraButtonText}>📷</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Caption</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What are you wearing?"
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={[styles.postButton, loading && styles.buttonDisabled]}
        onPress={handlePost}
        disabled={loading}
      >
        <Text style={styles.postButtonText}>{loading ? 'Posting...' : 'Post'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 24,
    color: '#999',
  },
  cameraButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreatePostScreen;


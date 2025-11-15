import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
// FIREBASE COMMENTED OUT FOR TESTING
// import { doc, setDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { auth, db, storage } from '../../services/firebase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const OnboardingScreen: React.FC<Props> = () => {
  const { refreshUser, setMockUser } = useAuth();
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleComplete = async () => {
    if (!name.trim() || !school.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
      // const user = auth.currentUser;
      // if (!user) {
      //   Alert.alert('Error', 'User not authenticated');
      //   return;
      // }
      // let profileImageUrl = '';
      // if (profileImage) {
      //   const response = await fetch(profileImage);
      //   const blob = await response.blob();
      //   const imageRef = ref(storage, `profiles/${user.uid}`);
      //   await uploadBytes(imageRef, blob);
      //   profileImageUrl = await getDownloadURL(imageRef);
      // }
      // await setDoc(doc(db, 'users', user.uid), {
      //   phoneNumber: user.phoneNumber || '',
      //   name: name.trim(),
      //   school: school.trim(),
      //   profileImageUrl,
      //   createdAt: new Date(),
      //   contactsImported: false,
      // });
      
      // Mock: Simulate save and create mock user
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create mock user with the entered data
      const mockUser: User = {
        id: 'mock-user-' + Date.now(),
        phoneNumber: '+1234567890', // Mock phone number
        name: name.trim(),
        school: school.trim(),
        profileImageUrl: profileImage || '',
        createdAt: new Date(),
        contactsImported: false,
      };
      
      // Set the user to trigger navigation to main app
      setMockUser(mockUser);
      
      // Navigation will happen automatically via AppNavigator when user is set
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', error.message || 'Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Tap to add photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="School/Community (e.g., UW-Madison) *"
        placeholderTextColor="#999"
        value={school}
        onChangeText={setSchool}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Setting up...' : 'Complete Setup'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  imageContainer: {
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;


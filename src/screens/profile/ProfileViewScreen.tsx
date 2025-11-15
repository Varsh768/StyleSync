import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
// FIREBASE COMMENTED OUT FOR TESTING
// import { signOut } from 'firebase/auth';
// import { auth } from '../../services/firebase';

type ProfileViewScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileView'>;

interface Props {
  navigation: ProfileViewScreenNavigationProp;
}

const ProfileViewScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
      // await signOut(auth);
      console.log('Mock: Sign out called');
      Alert.alert('Mock Mode', 'Sign out (Firebase disabled)');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        {user?.profileImageUrl ? (
          <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Photo</Text>
          </View>
        )}
        <Text style={styles.name}>{user?.name || 'Unknown'}</Text>
        <Text style={styles.school}>{user?.school || 'No school set'}</Text>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('FriendsList')}
        >
          <Text style={styles.menuText}>Friends</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('AddFriends')}
        >
          <Text style={styles.menuText}>Add Friends</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            // Navigate to friend requests - you can add this screen to navigation if needed
            Alert.alert('Friend Requests', 'Check your incoming friend requests in Add Friends');
          }}
        >
          <Text style={styles.menuText}>Friend Requests</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuText}>Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    color: '#999',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  school: {
    fontSize: 16,
    color: '#666',
  },
  menuSection: {
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
  signOutButton: {
    margin: 15,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileViewScreen;


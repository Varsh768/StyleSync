import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyClosetScreen from '../screens/closet/MyClosetScreen';
import AddItemScreen from '../screens/closet/AddItemScreen';
import EditItemScreen from '../screens/closet/EditItemScreen';
import FriendClosetScreen from '../screens/closet/FriendClosetScreen';
import ItemDetailScreen from '../screens/closet/ItemDetailScreen';
import FeedTabsScreen from '../screens/feed/FeedTabsScreen';
import FeedListScreen from '../screens/feed/FeedListScreen';
import CreatePostScreen from '../screens/feed/CreatePostScreen';
import PostDetailScreen from '../screens/feed/PostDetailScreen';
import FeedPostItemsScreen from '../screens/feed/FeedPostItemsScreen';
import RequestsListScreen from '../screens/requests/RequestsListScreen';
import RequestDetailScreen from '../screens/requests/RequestDetailScreen';
import CreateRequestScreen from '../screens/requests/CreateRequestScreen';
import ProfileViewScreen from '../screens/profile/ProfileViewScreen';
import FriendsListScreen from '../screens/profile/FriendsListScreen';
import AddFriendsScreen from '../screens/profile/AddFriendsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import SocialHomeScreen from '../screens/social/SocialHomeScreen';
import FriendsScreen from '../screens/social/FriendsScreen';
import GroupsScreen from '../screens/social/GroupsScreen';
import CommunitiesScreen from '../screens/social/CommunitiesScreen';
import CreateGroupScreen from '../screens/social/CreateGroupScreen';
import JoinGroupScreen from '../screens/social/JoinGroupScreen';
import JoinCommunityScreen from '../screens/social/JoinCommunityScreen';
import UserProfileScreen from '../screens/social/UserProfileScreen';
import GroupDetailScreen from '../screens/social/GroupDetailScreen';
import MessagesScreen from '../screens/social/MessagesScreen';
import MessagesListScreen from '../screens/social/MessagesListScreen';
import FriendRequestsScreen from '../screens/profile/FriendRequestsScreen';
import NotificationHeader from '../components/NotificationHeader';
import HeaderIcons from '../components/HeaderIcons';
import {
  MainTabParamList,
  ClosetStackParamList,
  FeedStackParamList,
  RequestsStackParamList,
  ProfileStackParamList,
  SocialStackParamList,
} from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const ClosetStack = createStackNavigator<ClosetStackParamList>();
const FeedStack = createStackNavigator<FeedStackParamList>();
const RequestsStack = createStackNavigator<RequestsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const SocialStack = createStackNavigator<SocialStackParamList>();

const ClosetNavigator = () => (
  <ClosetStack.Navigator screenOptions={{ headerShown: true }}>
    <ClosetStack.Screen
      name="MyCloset"
      component={MyClosetScreen}
      options={{
        title: 'My Closet',
        headerRight: () => <HeaderIcons />,
      }}
    />
    <ClosetStack.Screen
      name="AddItem"
      component={AddItemScreen}
      options={{ title: 'Add Item', headerRight: () => <HeaderIcons /> }}
    />
    <ClosetStack.Screen
      name="EditItem"
      component={EditItemScreen}
      options={{ title: 'Edit Item', headerRight: () => <HeaderIcons /> }}
    />
    <ClosetStack.Screen
      name="ItemDetail"
      component={ItemDetailScreen}
      options={{ title: 'Item Details', headerRight: () => <HeaderIcons /> }}
    />
  </ClosetStack.Navigator>
);

const FeedNavigator = () => (
  <FeedStack.Navigator screenOptions={{ headerShown: true }}>
    <FeedStack.Screen
      name="FeedTabs"
      component={FeedTabsScreen}
      options={({ navigation }) => ({
        title: 'Feed',
        headerLeft: () => (
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Text style={styles.postButtonText}>+ Post</Text>
          </TouchableOpacity>
        ),
        headerRight: () => <HeaderIcons />,
      })}
    />
    <FeedStack.Screen
      name="CreatePost"
      component={CreatePostScreen}
      options={{ title: 'Create Post', headerRight: () => <HeaderIcons /> }}
    />
    <FeedStack.Screen
      name="PostDetail"
      component={PostDetailScreen}
      options={{ title: 'Post', headerRight: () => <HeaderIcons /> }}
    />
    <FeedStack.Screen
      name="FeedPostItems"
      component={FeedPostItemsScreen}
      options={{ title: 'Items in Post', headerRight: () => <HeaderIcons /> }}
    />
  </FeedStack.Navigator>
);

const RequestsNavigator = () => (
  <RequestsStack.Navigator>
    <RequestsStack.Screen name="RequestsList" component={RequestsListScreen} options={{ title: 'Requests' }} />
    <RequestsStack.Screen
      name="RequestDetail"
      component={RequestDetailScreen}
      options={{ title: 'Request Details' }}
    />
    <RequestsStack.Screen
      name="CreateRequest"
      component={CreateRequestScreen}
      options={{ title: 'Request Item' }}
    />
  </RequestsStack.Navigator>
);

const SocialNavigator = () => (
  <SocialStack.Navigator screenOptions={{ headerShown: true }}>
    <SocialStack.Screen
      name="SocialHome"
      component={SocialHomeScreen}
      options={{ title: 'Social', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="Friends"
      component={FriendsScreen}
      options={{ title: 'Friends', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="Groups"
      component={GroupsScreen}
      options={{ title: 'Groups', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="Communities"
      component={CommunitiesScreen}
      options={{ title: 'Communities', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="AddFriends"
      component={AddFriendsScreen}
      options={{ title: 'Add Friends', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="FriendRequests"
      component={FriendRequestsScreen}
      options={{ title: 'Friend Requests', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="CreateGroup"
      component={CreateGroupScreen}
      options={{ title: 'Create Group', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="JoinGroup"
      component={JoinGroupScreen}
      options={{ title: 'Join Group', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="JoinCommunity"
      component={JoinCommunityScreen}
      options={{ title: 'Join Community', headerRight: () => <HeaderIcons /> }}
    />
    <SocialStack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={({ route }) => ({
        title: 'Profile',
        headerRight: () => <HeaderIcons />,
      })}
    />
    <SocialStack.Screen
      name="GroupDetail"
      component={GroupDetailScreen}
      options={({ route }) => ({
        title: route.params.groupName,
        headerRight: () => <HeaderIcons />,
      })}
    />
    <SocialStack.Screen
      name="FriendCloset"
      component={FriendClosetScreen}
      options={({ route }) => ({
        title: `${route.params.friendName}'s Closet`,
        headerRight: () => <HeaderIcons />,
      })}
    />
    <SocialStack.Screen
      name="MessagesList"
      component={MessagesListScreen}
      options={({ navigation }) => ({
        title: 'Messages',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
        ),
        headerRight: () => <HeaderIcons />,
        headerBackTitleVisible: false,
      })}
    />
    <SocialStack.Screen
      name="Messages"
      component={MessagesScreen}
      options={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
        ),
        headerRight: () => <HeaderIcons />,
        headerBackTitleVisible: false,
      })}
    />
  </SocialStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: true }}>
    <ProfileStack.Screen
      name="ProfileView"
      component={ProfileViewScreen}
      options={{ title: 'Profile', headerRight: () => <HeaderIcons /> }}
    />
    <ProfileStack.Screen
      name="FriendsList"
      component={FriendsListScreen}
      options={{ title: 'Friends', headerRight: () => <HeaderIcons /> }}
    />
    <ProfileStack.Screen
      name="AddFriends"
      component={AddFriendsScreen}
      options={{ title: 'Add Friends', headerRight: () => <HeaderIcons /> }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Settings', headerRight: () => <HeaderIcons /> }}
    />
  </ProfileStack.Navigator>
);


const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Closet') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Social') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Closet" component={ClosetNavigator} />
      <Tab.Screen name="Feed" component={FeedNavigator} />
      <Tab.Screen name="Social" component={SocialNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  postButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 15,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MainNavigator;


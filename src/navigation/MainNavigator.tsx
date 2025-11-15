import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import MyClosetScreen from '../screens/closet/MyClosetScreen';
import AddItemScreen from '../screens/closet/AddItemScreen';
import EditItemScreen from '../screens/closet/EditItemScreen';
import FriendClosetScreen from '../screens/closet/FriendClosetScreen';
import ItemDetailScreen from '../screens/closet/ItemDetailScreen';
import FeedListScreen from '../screens/feed/FeedListScreen';
import CreatePostScreen from '../screens/feed/CreatePostScreen';
import PostDetailScreen from '../screens/feed/PostDetailScreen';
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
import FriendRequestsScreen from '../screens/profile/FriendRequestsScreen';
import NotificationHeader from '../components/NotificationHeader';
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
        headerRight: () => <NotificationHeader />,
      }}
    />
    <ClosetStack.Screen
      name="AddItem"
      component={AddItemScreen}
      options={{ title: 'Add Item', headerRight: () => <NotificationHeader /> }}
    />
    <ClosetStack.Screen
      name="EditItem"
      component={EditItemScreen}
      options={{ title: 'Edit Item', headerRight: () => <NotificationHeader /> }}
    />
    <ClosetStack.Screen
      name="FriendCloset"
      component={FriendClosetScreen}
      options={({ route }) => ({
        title: `${route.params.friendName}'s Closet`,
        headerRight: () => <NotificationHeader />,
      })}
    />
    <ClosetStack.Screen
      name="ItemDetail"
      component={ItemDetailScreen}
      options={{ title: 'Item Details', headerRight: () => <NotificationHeader /> }}
    />
  </ClosetStack.Navigator>
);

const FeedNavigator = () => (
  <FeedStack.Navigator screenOptions={{ headerShown: true }}>
    <FeedStack.Screen
      name="FeedList"
      component={FeedListScreen}
      options={{ title: 'Feed', headerRight: () => <NotificationHeader /> }}
    />
    <FeedStack.Screen
      name="CreatePost"
      component={CreatePostScreen}
      options={{ title: 'Create Post', headerRight: () => <NotificationHeader /> }}
    />
    <FeedStack.Screen
      name="PostDetail"
      component={PostDetailScreen}
      options={{ title: 'Post', headerRight: () => <NotificationHeader /> }}
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
      options={{ title: 'Social', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="Friends"
      component={FriendsScreen}
      options={{ title: 'Friends', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="Groups"
      component={GroupsScreen}
      options={{ title: 'Groups', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="Communities"
      component={CommunitiesScreen}
      options={{ title: 'Communities', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="AddFriends"
      component={AddFriendsScreen}
      options={{ title: 'Add Friends', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="FriendRequests"
      component={FriendRequestsScreen}
      options={{ title: 'Friend Requests', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="CreateGroup"
      component={CreateGroupScreen}
      options={{ title: 'Create Group', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="JoinGroup"
      component={JoinGroupScreen}
      options={{ title: 'Join Group', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="JoinCommunity"
      component={JoinCommunityScreen}
      options={{ title: 'Join Community', headerRight: () => <NotificationHeader /> }}
    />
    <SocialStack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={({ route }) => ({
        title: 'Profile',
        headerRight: () => <NotificationHeader />,
      })}
    />
    <SocialStack.Screen
      name="GroupDetail"
      component={GroupDetailScreen}
      options={({ route }) => ({
        title: route.params.groupName,
        headerRight: () => <NotificationHeader />,
      })}
    />
  </SocialStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: true }}>
    <ProfileStack.Screen
      name="ProfileView"
      component={ProfileViewScreen}
      options={{ title: 'Profile', headerRight: () => <NotificationHeader /> }}
    />
    <ProfileStack.Screen
      name="FriendsList"
      component={FriendsListScreen}
      options={{ title: 'Friends', headerRight: () => <NotificationHeader /> }}
    />
    <ProfileStack.Screen
      name="AddFriends"
      component={AddFriendsScreen}
      options={{ title: 'Add Friends', headerRight: () => <NotificationHeader /> }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Settings', headerRight: () => <NotificationHeader /> }}
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

export default MainNavigator;


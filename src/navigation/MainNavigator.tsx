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
import {
  MainTabParamList,
  ClosetStackParamList,
  FeedStackParamList,
  RequestsStackParamList,
  ProfileStackParamList,
} from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const ClosetStack = createStackNavigator<ClosetStackParamList>();
const FeedStack = createStackNavigator<FeedStackParamList>();
const RequestsStack = createStackNavigator<RequestsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const ClosetNavigator = () => (
  <ClosetStack.Navigator>
    <ClosetStack.Screen name="MyCloset" component={MyClosetScreen} options={{ title: 'My Closet' }} />
    <ClosetStack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Add Item' }} />
    <ClosetStack.Screen name="EditItem" component={EditItemScreen} options={{ title: 'Edit Item' }} />
    <ClosetStack.Screen
      name="FriendCloset"
      component={FriendClosetScreen}
      options={({ route }) => ({ title: `${route.params.friendName}'s Closet` })}
    />
    <ClosetStack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: 'Item Details' }} />
  </ClosetStack.Navigator>
);

const FeedNavigator = () => (
  <FeedStack.Navigator>
    <FeedStack.Screen name="FeedList" component={FeedListScreen} options={{ title: 'Feed' }} />
    <FeedStack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create Post' }} />
    <FeedStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
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

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="ProfileView" component={ProfileViewScreen} options={{ title: 'Profile' }} />
    <ProfileStack.Screen name="FriendsList" component={FriendsListScreen} options={{ title: 'Friends' }} />
    <ProfileStack.Screen name="AddFriends" component={AddFriendsScreen} options={{ title: 'Add Friends' }} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
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
          } else if (route.name === 'Requests') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
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
      <Tab.Screen name="Requests" component={RequestsNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;


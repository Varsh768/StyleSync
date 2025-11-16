export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  school: string;
  profileImageUrl?: string;
  createdAt: Date;
  contactsImported?: boolean;
}

export interface ClosetItem {
  id: string;
  ownerId: string;
  images: string[];
  title: string;
  brand?: string;
  size?: string;
  category: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Friendship {
  id: string;
  userAId: string;
  userBId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  borrowerId: string;
  lenderId: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  imageUrls: string[];
  caption?: string;
  taggedItemIds?: string[];
  visibility: 'friends';
  createdAt: Date;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Notifications: undefined;
  Welcome: undefined;
  PhoneEntry: undefined;
  OTPVerification: { phoneNumber: string; verificationId: string };
  Onboarding: undefined;
};

export type MainTabParamList = {
  Closet: undefined;
  Feed: undefined;
  Social: undefined;
  Profile: undefined;
};

export type SocialStackParamList = {
  SocialHome: undefined;
  Friends: undefined;
  Groups: undefined;
  Communities: undefined;
  AddFriends: undefined;
  FriendRequests: undefined;
  CreateGroup: undefined;
  JoinGroup: undefined;
  JoinCommunity: undefined;
  UserProfile: { userId: string };
  GroupDetail: { groupId: string; groupName: string };
  FriendCloset: { friendId: string; friendName: string };
};

export type NotificationsStackParamList = {
  NotificationsList: undefined;
  NotificationDetail: { notificationId: string };
};

export type ClosetStackParamList = {
  MyCloset: undefined;
  AddItem: undefined;
  EditItem: { itemId: string };
  ItemDetail: { itemId: string; friendId?: string };
};

export type FeedStackParamList = {
  FeedList: undefined;
  CreatePost: undefined;
  PostDetail: { postId: string };
};

export type RequestsStackParamList = {
  RequestsList: undefined;
  RequestDetail: { requestId: string };
  CreateRequest: { itemId: string; friendId: string };
};

export type ProfileStackParamList = {
  ProfileView: undefined;
  FriendsList: undefined;
  AddFriends: undefined;
  Settings: undefined;
};


// Local storage service for hardcoded data (no Firebase)
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOSET_ITEMS_KEY = '@stylesync:closet_items';

export interface StoredClosetItem {
  id: string;
  ownerId: string;
  images: string[];
  title: string;
  brand?: string;
  size?: string;
  category: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export const saveClosetItem = async (item: Omit<StoredClosetItem, 'id' | 'createdAt'>): Promise<StoredClosetItem> => {
  try {
    const items = await getClosetItems();
    const newItem: StoredClosetItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    await AsyncStorage.setItem(CLOSET_ITEMS_KEY, JSON.stringify(items));
    return newItem;
  } catch (error) {
    console.error('Error saving closet item:', error);
    throw error;
  }
};

export const getClosetItems = async (ownerId?: string): Promise<StoredClosetItem[]> => {
  try {
    const data = await AsyncStorage.getItem(CLOSET_ITEMS_KEY);
    if (!data) return [];
    const items: StoredClosetItem[] = JSON.parse(data);
    if (ownerId) {
      return items.filter((item) => item.ownerId === ownerId && item.isActive);
    }
    return items.filter((item) => item.isActive);
  } catch (error) {
    console.error('Error getting closet items:', error);
    return [];
  }
};

export const getClosetItem = async (itemId: string): Promise<StoredClosetItem | null> => {
  try {
    const items = await getClosetItems();
    return items.find((item) => item.id === itemId) || null;
  } catch (error) {
    console.error('Error getting closet item:', error);
    return null;
  }
};

export const updateClosetItem = async (itemId: string, updates: Partial<StoredClosetItem>): Promise<void> => {
  try {
    const items = await getClosetItems();
    const index = items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      await AsyncStorage.setItem(CLOSET_ITEMS_KEY, JSON.stringify(items));
    }
  } catch (error) {
    console.error('Error updating closet item:', error);
    throw error;
  }
};

export const deleteClosetItem = async (itemId: string): Promise<void> => {
  try {
    await updateClosetItem(itemId, { isActive: false });
  } catch (error) {
    console.error('Error deleting closet item:', error);
    throw error;
  }
};

// Posts storage
const POSTS_KEY = '@stylesync:posts';

export interface StoredPost {
  id: string;
  authorId: string;
  authorName?: string;
  imageUrls: string[];
  caption?: string;
  taggedItemIds?: string[];
  visibility: 'friends';
  createdAt: string;
}

export const savePost = async (post: Omit<StoredPost, 'id' | 'createdAt'>): Promise<StoredPost> => {
  try {
    const posts = await getPosts();
    const newPost: StoredPost = {
      ...post,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return newPost;
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
};

export const getPosts = async (): Promise<StoredPost[]> => {
  try {
    const data = await AsyncStorage.getItem(POSTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

// Notifications storage
const NOTIFICATIONS_KEY = '@stylesync:notifications';

export interface StoredNotification {
  id: string;
  type: 'friend_request' | 'borrow_request' | 'like';
  title: string;
  message: string;
  userId?: string;
  userName?: string;
  postId?: string;
  requestId?: string;
  read: boolean;
  createdAt: string;
}

const NOTIFICATIONS_VIEWED_KEY = '@stylesync:notifications_viewed';

export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    // Check if notifications have been viewed
    const viewed = await AsyncStorage.getItem(NOTIFICATIONS_VIEWED_KEY);
    if (viewed === 'true') {
      return 0; // All notifications have been viewed
    }
    // If not viewed yet, return count from hardcoded notifications (3 unread)
    return 3;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    // Return default count from hardcoded notifications
    return 3;
  }
};

export const markNotificationsAsViewed = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_VIEWED_KEY, 'true');
  } catch (error) {
    console.error('Error marking notifications as viewed:', error);
  }
};


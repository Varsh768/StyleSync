import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationsStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';

type NotificationsScreenNavigationProp = StackNavigationProp<
  NotificationsStackParamList,
  'NotificationsList'
>;

interface Props {
  navigation: NotificationsScreenNavigationProp;
}

interface Notification {
  id: string;
  type: 'friend_request' | 'borrow_request' | 'like';
  title: string;
  message: string;
  userId?: string;
  userName?: string;
  postId?: string;
  requestId?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'friend_requests' | 'borrow_requests' | 'likes'>(
    'all'
  );

  const loadNotifications = async () => {
    // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
    // Mock: Return empty array for now
    setNotifications([]);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return '👤';
      case 'borrow_request':
        return '👕';
      case 'like':
        return '❤️';
      default:
        return '🔔';
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'friend_requests') return notif.type === 'friend_request';
    if (activeTab === 'borrow_requests') return notif.type === 'borrow_request';
    if (activeTab === 'likes') return notif.type === 'like';
    return true;
  });

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => {
        // Navigate based on notification type
        if (item.type === 'friend_request') {
          // Navigate to friend requests
        } else if (item.type === 'borrow_request') {
          // Navigate to request detail
          if (item.requestId) {
            (navigation as any).navigate('Requests', {
              screen: 'RequestDetail',
              params: { requestId: item.requestId },
            });
          }
        } else if (item.type === 'like' && item.postId) {
          // Navigate to post detail
          (navigation as any).navigate('Feed', {
            screen: 'PostDetail',
            params: { postId: item.postId },
          });
        }
      }}
    >
      <Text style={styles.notificationIcon}>{getNotificationIcon(item.type)}</Text>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {item.createdAt.toLocaleDateString()} {item.createdAt.toLocaleTimeString()}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friend_requests' && styles.activeTab]}
            onPress={() => setActiveTab('friend_requests')}
          >
            <Text
              style={[styles.tabText, activeTab === 'friend_requests' && styles.activeTabText]}
            >
              Friend Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'borrow_requests' && styles.activeTab]}
            onPress={() => setActiveTab('borrow_requests')}
          >
            <Text
              style={[styles.tabText, activeTab === 'borrow_requests' && styles.activeTabText]}
            >
              Borrow Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
            onPress={() => setActiveTab('likes')}
          >
            <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>
              Likes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {filteredNotifications.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadNotifications} />}
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
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  unreadCard: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default NotificationsScreen;


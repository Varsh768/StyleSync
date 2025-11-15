import React, { useEffect, useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationsStackParamList } from '../types';
import { getUnreadNotificationCount } from '../services/localStorage';

type NavigationProp = StackNavigationProp<any>;

interface NotificationHeaderProps {
  notificationCount?: number;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({ notificationCount: propCount }) => {
  const navigation = useNavigation<NavigationProp>();
  const [unreadCount, setUnreadCount] = useState(propCount || 0);

  const loadUnreadCount = async () => {
    const count = await getUnreadNotificationCount();
    setUnreadCount(count);
  };

  useEffect(() => {
    loadUnreadCount();

    // Set up navigation listener to refresh count on navigation changes
    const unsubscribe = navigation.addListener('state', () => {
      // Small delay to ensure AsyncStorage is updated
      setTimeout(() => {
        loadUnreadCount();
      }, 100);
    });

    // Also set up interval to periodically check (as backup)
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigation]);

  // Reload count when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [])
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        // Navigate to notifications screen
        (navigation as any).navigate('Notifications', {
          screen: 'NotificationsList',
        });
      }}
    >
      <Ionicons name="notifications-outline" size={24} color="#000" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default NotificationHeader;


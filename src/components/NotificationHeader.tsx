import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationsStackParamList } from '../types';

type NavigationProp = StackNavigationProp<any>;

interface NotificationHeaderProps {
  notificationCount?: number;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({ notificationCount = 0 }) => {
  const navigation = useNavigation<NavigationProp>();

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
      {notificationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
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


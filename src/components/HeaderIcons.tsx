import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NotificationHeader from './NotificationHeader';

type NavigationProp = StackNavigationProp<any>;

const HeaderIcons: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          // Navigate to messages list in Social stack
          (navigation as any).navigate('Social', {
            screen: 'MessagesList',
          });
        }}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#000" />
      </TouchableOpacity>
      <NotificationHeader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
  },
});

export default HeaderIcons;

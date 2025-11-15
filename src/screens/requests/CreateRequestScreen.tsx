import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RequestsStackParamList } from '../../types';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { ClosetItem } from '../../types';

type CreateRequestScreenNavigationProp = StackNavigationProp<RequestsStackParamList, 'CreateRequest'>;
type CreateRequestScreenRouteProp = RouteProp<RequestsStackParamList, 'CreateRequest'>;

interface Props {
  navigation: CreateRequestScreenNavigationProp;
  route: CreateRequestScreenRouteProp;
}

const CreateRequestScreen: React.FC<Props> = ({ navigation, route }) => {
  const { itemId, friendId } = route.params;
  const { user } = useAuth();
  const [item, setItem] = useState<ClosetItem | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItem();
  }, [itemId]);

  const loadItem = async () => {
    try {
      const itemDoc = await getDoc(doc(db, 'closet_items', itemId));
      if (itemDoc.exists()) {
        const data = itemDoc.data();
        setItem({
          id: itemDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as ClosetItem);
      }
    } catch (error) {
      console.error('Error loading item:', error);
      Alert.alert('Error', 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'borrow_requests'), {
        itemId,
        borrowerId: user.id,
        lenderId: friendId,
        startDate: start,
        endDate: end,
        status: 'pending',
        notes: notes.trim() || null,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Request sent!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Error creating request:', error);
      Alert.alert('Error', error.message || 'Failed to create request. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !item) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Item</Text>
        <Text style={styles.itemInfo}>{item.category}</Text>
        {item.brand && <Text style={styles.itemInfo}>{item.brand}</Text>}
        {item.size && <Text style={styles.itemInfo}>Size: {item.size}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Start Date *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>End Date *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Event, occasion, etc."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, saving && styles.buttonDisabled]}
        onPress={handleCreateRequest}
        disabled={saving}
      >
        <Text style={styles.submitButtonText}>{saving ? 'Sending...' : 'Send Request'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  itemInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateRequestScreen;


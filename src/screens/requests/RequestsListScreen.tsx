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
import { RequestsStackParamList } from '../../types';
import { collection, query, where, getDocs, orderBy, or } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { BorrowRequest } from '../../types';

type RequestsListScreenNavigationProp = StackNavigationProp<RequestsStackParamList, 'RequestsList'>;

interface Props {
  navigation: RequestsListScreenNavigationProp;
}

const RequestsListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<BorrowRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<BorrowRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    if (!user) return;

    try {
      // Load incoming requests (where user is lender)
      const incomingQuery = query(
        collection(db, 'borrow_requests'),
        where('lenderId', '==', user.id),
        orderBy('createdAt', 'desc')
      );
      const incomingSnapshot = await getDocs(incomingQuery);
      const incomingData = incomingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as BorrowRequest[];
      setIncomingRequests(incomingData);

      // Load outgoing requests (where user is borrower)
      const outgoingQuery = query(
        collection(db, 'borrow_requests'),
        where('borrowerId', '==', user.id),
        orderBy('createdAt', 'desc')
      );
      const outgoingSnapshot = await getDocs(outgoingQuery);
      const outgoingData = outgoingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as BorrowRequest[];
      setOutgoingRequests(outgoingData);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return '#34C759';
      case 'declined':
        return '#FF3B30';
      case 'completed':
        return '#8E8E93';
      default:
        return '#FF9500';
    }
  };

  const renderRequest = ({ item }: { item: BorrowRequest }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => navigation.navigate('RequestDetail', { requestId: item.id })}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestId}>Request #{item.id.slice(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.requestDate}>
        {item.startDate.toLocaleDateString()} - {item.endDate.toLocaleDateString()}
      </Text>
      {item.notes && <Text style={styles.requestNotes}>{item.notes}</Text>}
    </TouchableOpacity>
  );

  const requests = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'incoming' && styles.activeTab]}
          onPress={() => setActiveTab('incoming')}
        >
          <Text style={[styles.tabText, activeTab === 'incoming' && styles.activeTabText]}>
            Incoming ({incomingRequests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'outgoing' && styles.activeTab]}
          onPress={() => setActiveTab('outgoing')}
        >
          <Text style={[styles.tabText, activeTab === 'outgoing' && styles.activeTabText]}>
            Outgoing ({outgoingRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {requests.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No {activeTab === 'incoming' ? 'incoming' : 'outgoing'} requests
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadRequests} />}
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
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
  requestCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  requestId: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  requestDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  requestNotes: {
    fontSize: 14,
    color: '#333',
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

export default RequestsListScreen;


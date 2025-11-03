import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type UserType = 'all' | 'customers' | 'delivery';

export default function AdminUsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<UserType>('all');

  const userTypes: { key: UserType; label: string }[] = [
    { key: 'all', label: 'All Users' },
    { key: 'customers', label: 'Customers' },
    { key: 'delivery', label: 'Delivery Partners' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Users</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>👥 1,234 Customers</Text>
          <Text style={styles.statText}>🚚 28 Delivery Partners</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabsContainer}>
        {userTypes.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[styles.tab, selectedType === type.key && styles.tabActive]}
            onPress={() => setSelectedType(type.key)}
          >
            <Text style={[styles.tabText, selectedType === type.key && styles.tabTextActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.usersContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((user) => (
          <View key={user} style={styles.userCard}>
            <View style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {selectedType === 'delivery' ? 'Delivery Partner' : 'Customer'} {user}
              </Text>
              <Text style={styles.userEmail}>user{user}@example.com</Text>
              <Text style={styles.userPhone}>+91 98765 432{user}</Text>
              {selectedType === 'delivery' && (
                <Text style={styles.userMeta}>⭐ 4.{user} • {user * 50} deliveries</Text>
              )}
              {selectedType === 'customers' && (
                <Text style={styles.userMeta}>{user * 5} orders • ₹{user * 1200} spent</Text>
              )}
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.blockButton}>
                <Text style={styles.blockButtonText}>Block</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1e40af',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  statText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1e40af',
    fontWeight: '600',
  },
  usersContainer: {
    padding: 15,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e9ecef',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 11,
    color: '#999',
  },
  userActions: {
    gap: 6,
  },
  viewButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e40af',
  },
  viewButtonText: {
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '600',
  },
  blockButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  blockButtonText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
});


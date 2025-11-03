import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type ShopStatus = 'all' | 'active' | 'pending' | 'suspended';

export default function AdminShopsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ShopStatus>('all');

  const statuses: { key: ShopStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'pending', label: 'Pending' },
    { key: 'suspended', label: 'Suspended' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Shops</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search shops..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusContainer}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status.key}
            style={[
              styles.statusChip,
              selectedStatus === status.key && styles.statusChipActive,
            ]}
            onPress={() => setSelectedStatus(status.key)}
          >
            <Text
              style={[
                styles.statusChipText,
                selectedStatus === status.key && styles.statusChipTextActive,
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.shopsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((shop) => (
          <View key={shop} style={styles.shopCard}>
            <View style={styles.shopImage} />
            <View style={styles.shopInfo}>
              <View style={styles.shopHeader}>
                <Text style={styles.shopName}>Local Shop {shop}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
              <Text style={styles.ownerName}>Owner: Rajesh Kumar {shop}</Text>
              <View style={styles.shopMeta}>
                <Text style={styles.metaText}>⭐ 4.{shop}</Text>
                <Text style={styles.metaText}>• {shop * 25} products</Text>
                <Text style={styles.metaText}>• {shop * 40} orders</Text>
              </View>
              <View style={styles.shopActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.suspendButton}>
                  <Text style={styles.suspendButtonText}>Suspend</Text>
                </TouchableOpacity>
              </View>
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
  statusContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
  },
  statusChipActive: {
    backgroundColor: '#1e40af',
  },
  statusChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusChipTextActive: {
    color: '#fff',
  },
  shopsContainer: {
    padding: 15,
  },
  shopCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  shopInfo: {
    flex: 1,
    marginLeft: 15,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#d1fae5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  ownerName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  shopMeta: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 11,
    color: '#999',
    marginRight: 8,
  },
  shopActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e40af',
  },
  actionButtonText: {
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '600',
  },
  suspendButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  suspendButtonText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
});


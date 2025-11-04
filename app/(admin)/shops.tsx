import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { useAllShops } from '@/hooks/use-shops';
import { shopApi } from '@/services/api.helpers';

type ShopStatus = 'all' | 'active' | 'pending' | 'suspended';

export default function AdminShopsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ShopStatus>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Build query params based on selected status
  const getQueryParams = () => {
    const params: any = { limit: 100 };
    if (searchQuery) params.search = searchQuery;
    
    // For admin, we want to bypass the default 'approved' filter
    // by explicitly setting approvalStatus or isActive filters
    if (selectedStatus === 'pending') {
      params.approvalStatus = 'pending';
    } else if (selectedStatus === 'active') {
      params.approvalStatus = 'approved';
      params.isActive = 'true';
    } else if (selectedStatus === 'suspended') {
      params.approvalStatus = 'approved';
      params.isActive = 'false';
    } else {
      // For 'all', pass empty string to override default filter
      params.approvalStatus = '';
      params.isActive = '';
    }
    
    return params;
  };

  const { shops, loading, error, refetch } = useAllShops(getQueryParams());

  const statuses: { key: ShopStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'pending', label: 'Pending' },
    { key: 'suspended', label: 'Suspended' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleApprove = async (shopId: string) => {
    try {
      const response = await shopApi.approveShop(shopId);
      if (response.success) {
        Alert.alert('Success', 'Shop approved successfully');
        refetch();
      } else {
        Alert.alert('Error', response.error || 'Failed to approve shop');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    }
  };

  const handleReject = async (shopId: string) => {
    Alert.prompt(
      'Reject Shop',
      'Please provide a reason for rejection:',
      async (reason) => {
        if (reason) {
          try {
            const response = await shopApi.rejectShop(shopId, reason);
            if (response.success) {
              Alert.alert('Success', 'Shop rejected');
              refetch();
            } else {
              Alert.alert('Error', response.error || 'Failed to reject shop');
            }
          } catch (error) {
            Alert.alert('Error', 'An error occurred');
          }
        }
      }
    );
  };

  const handleToggleStatus = async (shopId: string) => {
    try {
      const response = await shopApi.toggleShopStatus(shopId);
      if (response.success) {
        Alert.alert('Success', 'Shop status updated');
        refetch();
      } else {
        Alert.alert('Error', response.error || 'Failed to update status');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    }
  };

  const getStatusBadge = (shop: any) => {
    if (shop.approvalStatus === 'pending') {
      return { text: 'Pending', style: styles.statusBadgePending };
    } else if (!shop.isActive) {
      return { text: 'Suspended', style: styles.statusBadgeSuspended };
    } else {
      return { text: 'Active', style: styles.statusBadgeActive };
    }
  };

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

      <ScrollView 
        style={styles.shopsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#1e40af" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : shops.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No shops found</Text>
            <Text style={styles.emptySubtext}>
              {selectedStatus === 'pending' 
                ? 'No pending approval requests' 
                : 'Try adjusting your filters'}
            </Text>
          </View>
        ) : (
          shops.map((shop: any) => {
            const statusBadge = getStatusBadge(shop);
            return (
              <View key={shop._id} style={styles.shopCard}>
                <View style={styles.shopImage}>
                  <Text style={styles.shopImagePlaceholder}>🏪</Text>
                </View>
                <View style={styles.shopInfo}>
                  <View style={styles.shopHeader}>
                    <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
                    <View style={[styles.statusBadge, statusBadge.style]}>
                      <Text style={styles.statusText}>{statusBadge.text}</Text>
                    </View>
                  </View>
                  <Text style={styles.ownerName}>
                    Owner: {shop.owner?.name || 'Unknown'}
                  </Text>
                  <Text style={styles.categoryText}>{shop.category}</Text>
                  <View style={styles.shopMeta}>
                    <Text style={styles.metaText}>⭐ {shop.rating?.toFixed(1) || '0.0'}</Text>
                    <Text style={styles.metaText}>• {shop.totalProducts || 0} products</Text>
                    <Text style={styles.metaText}>• {shop.totalOrders || 0} orders</Text>
                  </View>
                  <View style={styles.shopActions}>
                    {shop.approvalStatus === 'pending' ? (
                      <>
                        <TouchableOpacity 
                          style={styles.approveButton}
                          onPress={() => handleApprove(shop._id)}
                        >
                          <Text style={styles.approveButtonText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.rejectButton}
                          onPress={() => handleReject(shop._id)}
                        >
                          <Text style={styles.rejectButtonText}>Reject</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity style={styles.actionButton}>
                          <Text style={styles.actionButtonText}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={shop.isActive ? styles.suspendButton : styles.activateButton}
                          onPress={() => handleToggleStatus(shop._id)}
                        >
                          <Text style={shop.isActive ? styles.suspendButtonText : styles.activateButtonText}>
                            {shop.isActive ? 'Suspend' : 'Activate'}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopImagePlaceholder: {
    fontSize: 32,
  },
  loader: {
    marginTop: 50,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  categoryText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  statusBadgeActive: {
    backgroundColor: '#d1fae5',
  },
  statusBadgePending: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeSuspended: {
    backgroundColor: '#fee2e2',
  },
  approveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  rejectButtonText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  activateButton: {
    backgroundColor: '#dbeafe',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activateButtonText: {
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '600',
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


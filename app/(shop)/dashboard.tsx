import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import { useShopContext } from '@/context/ShopContext';
import { useShopOrders } from '@/hooks/use-orders';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ShopDashboard() {
  const { shops, selectedShop: shop, isLoading: shopLoading, selectShop } = useShopContext();
  const { orders, loading: ordersLoading } = useShopOrders({ limit: 5, status: 'pending' });
  const [showShopSelector, setShowShopSelector] = useState(false);

  const shopError = null; // Handled by context

  console.log('📊 [DASHBOARD] Rendering dashboard');
  console.log('📊 [DASHBOARD] shopLoading:', shopLoading);
  console.log('📊 [DASHBOARD] shop:', shop);
  console.log('📊 [DASHBOARD] shops count:', shops?.length);

  if (shopLoading) {
    console.log('📊 [DASHBOARD] Showing loading screen');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading your shop...</Text>
      </View>
    );
  }

  if (shopError || !shop) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load shop data</Text>
        <Text style={styles.errorSubtext}>{shopError}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.shopSelector}
            onPress={() => shops.length > 1 && setShowShopSelector(true)}
          >
            <Text style={styles.shopName}>{shop.name}</Text>
            <View style={styles.shopSelectorRow}>
              <Text style={styles.shopCategory}>{shop.category}</Text>
              {shops.length > 1 && (
                <Ionicons name="chevron-down" size={16} color="#e8f5e9" style={{ marginLeft: 5 }} />
              )}
            </View>
          </TouchableOpacity>
          {shops.length > 1 && (
            <Text style={styles.shopCount}>{shops.length} shops</Text>
          )}
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.statusBadge, !shop.isActive && styles.statusBadgeClosed]}>
            <Text style={styles.statusText}>● {shop.isActive ? 'Open' : 'Closed'}</Text>
          </View>
        </View>
      </View>

      {/* Shop Selector Modal */}
      <Modal
        visible={showShopSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShopSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Shop</Text>
              <TouchableOpacity onPress={() => setShowShopSelector(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {shops.map((s) => (
              <TouchableOpacity
                key={s._id}
                style={[
                  styles.shopOption,
                  shop._id === s._id && styles.shopOptionSelected,
                ]}
                onPress={() => {
                  selectShop(s._id);
                  setShowShopSelector(false);
                }}
              >
                <View style={styles.shopOptionLeft}>
                  <Text style={styles.shopOptionName}>{s.name}</Text>
                  <Text style={styles.shopOptionCategory}>{s.category}</Text>
                </View>
                {shop._id === s._id && (
                  <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.addShopButton}
              onPress={() => {
                setShowShopSelector(false);
                // Small delay to ensure modal is closed before navigation
                setTimeout(() => {
                  router.push('/(shop)/setup');
                }, 100);
              }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#2E7D32" />
              <Text style={styles.addShopText}>Add New Shop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹0</Text>
          <Text style={styles.statLabel}>Today's Sales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{orders?.length || 0}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>-</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{shop.rating?.toFixed(1) || 'N/A'}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(shop)/setup')}
          >
            <Ionicons name="add-circle" size={32} color="#2E7D32" />
            <Text style={styles.quickActionText}>Add New Shop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(shop)/products')}
          >
            <Ionicons name="cube" size={32} color="#2E7D32" />
            <Text style={styles.quickActionText}>Manage Products</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(shop)/orders')}
          >
            <Ionicons name="receipt" size={32} color="#2E7D32" />
            <Text style={styles.quickActionText}>View Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => setShowShopSelector(true)}
          >
            <Ionicons name="swap-horizontal" size={32} color="#2E7D32" />
            <Text style={styles.quickActionText}>Switch Shop</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Shop Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Address:</Text>
            <Text style={styles.infoValue}>
              {shop.address?.street}, {shop.address?.city}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📞 Phone:</Text>
            <Text style={styles.infoValue}>{shop.phone}</Text>
          </View>
          {shop.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>✉️ Email:</Text>
              <Text style={styles.infoValue}>{shop.email}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏰ Hours:</Text>
            <Text style={styles.infoValue}>
              {shop.timings?.openTime} - {shop.timings?.closeTime}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>✅ Status:</Text>
            <Text style={[styles.infoValue, shop.approvalStatus === 'approved' ? styles.approvedText : styles.pendingText]}>
              {shop.approvalStatus?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {ordersLoading ? (
          <ActivityIndicator color="#2E7D32" />
        ) : orders && orders.length > 0 ? (
          orders.slice(0, 3).map((order: any) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
                <View style={styles.orderStatusBadge}>
                  <Text style={styles.orderStatusText}>{order.status}</Text>
                </View>
              </View>
              <Text style={styles.customerName}>Customer: {order.customer?.name || 'N/A'}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>₹{order.totalAmount}</Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent orders</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 14,
    color: '#e8f5e9',
  },
  statusBadge: {
    backgroundColor: '#4ade80',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusBadgeClosed: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderStatusBadge: {
    backgroundColor: '#fef3c7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  orderStatusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  viewButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  viewButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  alertText: {
    fontSize: 12,
    color: '#f59e0b',
  },
  restockButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  restockButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  approvedText: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  pendingText: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
  shopSelector: {
    flexDirection: 'column',
  },
  shopSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopCount: {
    fontSize: 12,
    color: '#e8f5e9',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  shopOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  shopOptionSelected: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  shopOptionLeft: {
    flex: 1,
  },
  shopOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  shopOptionCategory: {
    fontSize: 14,
    color: '#666',
  },
  addShopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderStyle: 'dashed',
  },
  addShopText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickActionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});


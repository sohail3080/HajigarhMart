import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type OrderStatus = 'active' | 'completed' | 'cancelled';

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState<OrderStatus>('active');

  const tabs: { key: OrderStatus; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.ordersContainer}>
        {selectedTab === 'active' && (
          <>
            {[1, 2, 3].map((order) => (
              <View key={order} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Order #{1000 + order}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>In Transit</Text>
                  </View>
                </View>

                <Text style={styles.orderDate}>Placed on Nov {order}, 2025</Text>
                <Text style={styles.shopName}>From: Local Shop {order}</Text>

                <View style={styles.orderItems}>
                  <Text style={styles.orderItemText}>• Product Item {order}</Text>
                  <Text style={styles.orderItemText}>• Product Item {order + 1}</Text>
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.totalAmount}>Total: ₹{order * 250}</Text>
                  <TouchableOpacity style={styles.trackButton}>
                    <Text style={styles.trackButtonText}>Track Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {selectedTab === 'completed' && (
          <>
            {[1, 2, 3, 4, 5].map((order) => (
              <View key={order} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Order #{2000 + order}</Text>
                  <View style={[styles.statusBadge, styles.statusBadgeCompleted]}>
                    <Text style={styles.statusText}>Delivered</Text>
                  </View>
                </View>

                <Text style={styles.orderDate}>Delivered on Oct {order}, 2025</Text>
                <Text style={styles.shopName}>From: Local Shop {order}</Text>

                <View style={styles.orderFooter}>
                  <Text style={styles.totalAmount}>Total: ₹{order * 180}</Text>
                  <TouchableOpacity style={styles.reorderButton}>
                    <Text style={styles.reorderButtonText}>Reorder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {selectedTab === 'cancelled' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No cancelled orders</Text>
          </View>
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
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  ordersContainer: {
    flex: 1,
    padding: 15,
  },
  orderCard: {
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
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusBadgeCompleted: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 10,
    marginBottom: 10,
  },
  orderItemText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  trackButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reorderButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  reorderButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
  },
});


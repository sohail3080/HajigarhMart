import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type OrderStatus = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';

export default function AdminOrdersScreen() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('all');

  const statuses: { key: OrderStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Orders</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>📦 3,456 Total Orders</Text>
          <Text style={styles.statText}>💰 ₹8.45L Revenue</Text>
        </View>
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

      <ScrollView style={styles.ordersContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((order) => (
          <View key={order} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{9000 + order}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Processing</Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer:</Text>
                <Text style={styles.detailValue}>John Doe {order}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Shop:</Text>
                <Text style={styles.detailValue}>Local Shop {order}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Delivery Partner:</Text>
                <Text style={styles.detailValue}>Partner {order}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>Nov {order}, 2025</Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.amountContainer}>
                <Text style={styles.orderAmount}>₹{order * 450}</Text>
                <Text style={styles.commission}>Commission: ₹{order * 45}</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
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
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  ordersContainer: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
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
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
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
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f8f9fa',
  },
  amountContainer: {},
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  commission: {
    fontSize: 11,
    color: '#059669',
  },
  viewButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e40af',
  },
  viewButtonText: {
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '600',
  },
});


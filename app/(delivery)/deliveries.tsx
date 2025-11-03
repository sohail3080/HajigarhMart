import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DeliveryStatus = 'active' | 'completed';

export default function DeliveriesScreen() {
  const [selectedTab, setSelectedTab] = useState<DeliveryStatus>('active');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Deliveries</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'completed' && styles.tabActive]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.deliveriesContainer}>
        {selectedTab === 'active' ? (
          <>
            {[1, 2].map((delivery) => (
              <View key={delivery} style={styles.deliveryCard}>
                <View style={styles.deliveryHeader}>
                  <Text style={styles.deliveryId}>Delivery #{7000 + delivery}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>In Progress</Text>
                  </View>
                </View>

                <View style={styles.routeInfo}>
                  <View style={styles.routePoint}>
                    <View style={styles.pointDot} />
                    <View style={styles.pointDetails}>
                      <Text style={styles.pointLabel}>Pickup</Text>
                      <Text style={styles.pointAddress}>Local Shop {delivery}</Text>
                    </View>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routePoint}>
                    <View style={[styles.pointDot, styles.pointDotEnd]} />
                    <View style={styles.pointDetails}>
                      <Text style={styles.pointLabel}>Delivery</Text>
                      <Text style={styles.pointAddress}>Customer Address, Hajigarh</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>Customer: John Doe {delivery}</Text>
                  <TouchableOpacity style={styles.callButton}>
                    <Text style={styles.callButtonText}>📞 Call</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.deliveryFooter}>
                  <Text style={styles.amount}>₹{delivery * 350}</Text>
                  <TouchableOpacity style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>Mark as Delivered</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map((delivery) => (
              <View key={delivery} style={styles.completedCard}>
                <View style={styles.completedHeader}>
                  <Text style={styles.deliveryId}>Delivery #{8000 + delivery}</Text>
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>✓ Delivered</Text>
                  </View>
                </View>
                <Text style={styles.completedDate}>Completed on Nov {delivery}, 2025</Text>
                <View style={styles.completedFooter}>
                  <Text style={styles.customerName}>Customer: John Doe {delivery}</Text>
                  <Text style={styles.earning}>+₹{delivery * 50}</Text>
                </View>
              </View>
            ))}
          </>
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
  deliveriesContainer: {
    flex: 1,
    padding: 15,
  },
  deliveryCard: {
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
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  deliveryId: {
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
  routeInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2E7D32',
    marginTop: 4,
    marginRight: 10,
  },
  pointDotEnd: {
    backgroundColor: '#dc2626',
  },
  pointDetails: {
    flex: 1,
  },
  pointLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  pointAddress: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#2E7D32',
    marginLeft: 5,
    marginVertical: 5,
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  completeButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  completedCard: {
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
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedBadge: {
    backgroundColor: '#d1fae5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  completedBadgeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  completedDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  completedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earning: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});


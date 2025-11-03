import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DeliveryDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Delivery Partner! 👋</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>● Online</Text>
          </View>
          <TouchableOpacity style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>Go Offline</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹1,250</Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Today's Deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12.5</Text>
          <Text style={styles.statLabel}>km Travelled</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Deliveries</Text>
        {[1, 2].map((delivery) => (
          <View key={delivery} style={styles.deliveryCard}>
            <View style={styles.deliveryHeader}>
              <Text style={styles.deliveryId}>Delivery #{5000 + delivery}</Text>
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>High Priority</Text>
              </View>
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <View style={styles.locationDetails}>
                  <Text style={styles.locationLabel}>Pickup</Text>
                  <Text style={styles.locationText}>Local Shop {delivery}</Text>
                </View>
              </View>
              <View style={styles.locationDivider} />
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>🎯</Text>
                <View style={styles.locationDetails}>
                  <Text style={styles.locationLabel}>Delivery</Text>
                  <Text style={styles.locationText}>Customer Address, Hajigarh</Text>
                </View>
              </View>
            </View>

            <View style={styles.deliveryFooter}>
              <View>
                <Text style={styles.customerName}>John Doe {delivery}</Text>
                <Text style={styles.orderValue}>₹{delivery * 350}</Text>
              </View>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Delivery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Deliveries</Text>
        {[1, 2, 3].map((delivery) => (
          <View key={delivery} style={styles.availableCard}>
            <View style={styles.availableHeader}>
              <Text style={styles.deliveryId}>Delivery #{6000 + delivery}</Text>
              <Text style={styles.distance}>{delivery}.2 km away</Text>
            </View>
            <Text style={styles.shopName}>From: Local Shop {delivery}</Text>
            <View style={styles.availableFooter}>
              <Text style={styles.earningAmount}>₹{delivery * 50} earning</Text>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#4ade80',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: '#2E7D32',
    fontSize: 14,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  deliveryCard: {
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
  priorityBadge: {
    backgroundColor: '#fee2e2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  locationDivider: {
    height: 15,
    width: 2,
    backgroundColor: '#2E7D32',
    marginLeft: 10,
    marginVertical: 5,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  startButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  availableCard: {
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
  availableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distance: {
    fontSize: 12,
    color: '#666',
  },
  shopName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  availableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  acceptButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  acceptButtonText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
});


import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>HajigarhMart Management</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏪</Text>
          <Text style={styles.statValue}>45</Text>
          <Text style={styles.statLabel}>Total Shops</Text>
          <Text style={styles.statChange}>+3 this week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>👥</Text>
          <Text style={styles.statValue}>1,234</Text>
          <Text style={styles.statLabel}>Total Customers</Text>
          <Text style={styles.statChange}>+87 this week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🚚</Text>
          <Text style={styles.statValue}>28</Text>
          <Text style={styles.statLabel}>Delivery Partners</Text>
          <Text style={styles.statChange}>+2 this week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statValue}>3,456</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
          <Text style={styles.statChange}>+245 today</Text>
        </View>
      </View>

      <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
          <Text style={styles.revenueTitle}>Platform Revenue</Text>
          <TouchableOpacity>
            <Text style={styles.viewDetails}>View Details</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.revenueAmount}>₹8,45,600</Text>
        <Text style={styles.revenueSubtext}>Total commission earned</Text>
        <View style={styles.revenueStats}>
          <View style={styles.revenueStat}>
            <Text style={styles.revenueStatLabel}>Today</Text>
            <Text style={styles.revenueStatValue}>₹12,450</Text>
          </View>
          <View style={styles.revenueStat}>
            <Text style={styles.revenueStatLabel}>This Month</Text>
            <Text style={styles.revenueStatValue}>₹2,45,600</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.approvalCard}>
            <View style={styles.approvalInfo}>
              <Text style={styles.approvalType}>Shop Registration</Text>
              <Text style={styles.approvalName}>New Local Shop {item}</Text>
              <Text style={styles.approvalDate}>Submitted 2 hours ago</Text>
            </View>
            <View style={styles.approvalActions}>
              <TouchableOpacity style={styles.approveButton}>
                <Text style={styles.approveButtonText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
        </View>
        {[
          { icon: '🛒', text: 'New order placed by Customer #123', time: '5 mins ago' },
          { icon: '🏪', text: 'Shop "Local Mart" updated inventory', time: '15 mins ago' },
          { icon: '✅', text: 'Delivery #7845 completed', time: '32 mins ago' },
          { icon: '👤', text: 'New customer registration', time: '1 hour ago' },
          { icon: '💰', text: 'Payment processed: ₹1,250', time: '2 hours ago' },
        ].map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Text style={styles.activityIcon}>{activity.icon}</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{activity.text}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
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
    backgroundColor: '#1e40af',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
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
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 11,
    color: '#2E7D32',
  },
  revenueCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  revenueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  viewDetails: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  revenueAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  revenueSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  revenueStats: {
    flexDirection: 'row',
    gap: 20,
  },
  revenueStat: {},
  revenueStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  revenueStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    color: '#1e40af',
    fontWeight: '600',
  },
  approvalCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  approvalInfo: {
    flex: 1,
  },
  approvalType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  approvalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  approvalDate: {
    fontSize: 12,
    color: '#999',
  },
  approvalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButtonText: {
    fontSize: 18,
    color: '#059669',
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 18,
    color: '#dc2626',
  },
  activityItem: {
    flexDirection: 'row',
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
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});


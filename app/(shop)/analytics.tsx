import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sales Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValue}>₹12,450</Text>
            <Text style={styles.statChange}>+12.5%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statValue}>₹65,280</Text>
            <Text style={styles.statChange}>+8.3%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>₹2,45,600</Text>
            <Text style={styles.statChange}>+15.7%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>₹8,50,000</Text>
            <Text style={styles.statChange}>-</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Statistics</Text>
        <View style={styles.orderStats}>
          <View style={styles.orderStatItem}>
            <Text style={styles.orderStatValue}>248</Text>
            <Text style={styles.orderStatLabel}>Total Orders</Text>
          </View>
          <View style={styles.orderStatItem}>
            <Text style={styles.orderStatValue}>12</Text>
            <Text style={styles.orderStatLabel}>Pending</Text>
          </View>
          <View style={styles.orderStatItem}>
            <Text style={styles.orderStatValue}>225</Text>
            <Text style={styles.orderStatLabel}>Completed</Text>
          </View>
          <View style={styles.orderStatItem}>
            <Text style={styles.orderStatValue}>11</Text>
            <Text style={styles.orderStatLabel}>Cancelled</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling Products</Text>
        {[1, 2, 3, 4, 5].map((product) => (
          <View key={product} style={styles.productRow}>
            <View style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>Product {product}</Text>
              <Text style={styles.productSales}>{product * 45} units sold</Text>
            </View>
            <Text style={styles.productRevenue}>₹{product * 4500}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Total Customers</Text>
            <Text style={styles.insightValue}>342</Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Repeat Customers</Text>
            <Text style={styles.insightValue}>128 (37%)</Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Average Order Value</Text>
            <Text style={styles.insightValue}>₹850</Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Customer Satisfaction</Text>
            <Text style={styles.insightValue}>4.5 ⭐</Text>
          </View>
        </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  orderStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'space-around',
  },
  orderStatItem: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 15,
  },
  orderStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  orderStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  productSales: {
    fontSize: 12,
    color: '#666',
  },
  productRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});


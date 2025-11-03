import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EarningsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Earnings</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Balance</Text>
        <Text style={styles.totalAmount}>₹12,450</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today</Text>
          <Text style={styles.statValue}>₹1,250</Text>
          <Text style={styles.statExtra}>8 deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This Week</Text>
          <Text style={styles.statValue}>₹5,680</Text>
          <Text style={styles.statExtra}>42 deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statValue}>₹18,450</Text>
          <Text style={styles.statExtra}>145 deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average/Day</Text>
          <Text style={styles.statValue}>₹850</Text>
          <Text style={styles.statExtra}>6 deliveries</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {[
          { type: 'credit', amount: 1250, desc: 'Today\'s earnings', date: 'Nov 3, 2025' },
          { type: 'debit', amount: 5000, desc: 'Withdrawal to bank', date: 'Nov 1, 2025' },
          { type: 'credit', amount: 950, desc: 'Yesterday\'s earnings', date: 'Nov 2, 2025' },
          { type: 'credit', amount: 1180, desc: 'Earnings', date: 'Nov 1, 2025' },
          { type: 'debit', amount: 3000, desc: 'Withdrawal to bank', date: 'Oct 28, 2025' },
        ].map((transaction, index) => (
          <View key={index} style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <View style={[
                styles.transactionIcon,
                transaction.type === 'credit' ? styles.creditIcon : styles.debitIcon
              ]}>
                <Text style={styles.transactionIconText}>
                  {transaction.type === 'credit' ? '↓' : '↑'}
                </Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc}>{transaction.desc}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </View>
            <Text style={[
              styles.transactionAmount,
              transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
            ]}>
              {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
            </Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
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
  statExtra: {
    fontSize: 11,
    color: '#999',
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
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: '#d1fae5',
  },
  debitIcon: {
    backgroundColor: '#fee2e2',
  },
  transactionIconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditAmount: {
    color: '#059669',
  },
  debitAmount: {
    color: '#dc2626',
  },
});


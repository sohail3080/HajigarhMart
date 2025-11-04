import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function DeliveryProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const menuItems = [
    { id: 1, title: 'Personal Information', icon: '👤' },
    { id: 2, title: 'Vehicle Details', icon: '🏍️' },
    { id: 3, title: 'Bank Account', icon: '🏦' },
    { id: 4, title: 'Documents', icon: '📄' },
    { id: 5, title: 'Settings', icon: '⚙️' },
    { id: 6, title: 'Help & Support', icon: '❓' },
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
              setTimeout(() => {
                router.replace('/(auth)/login');
              }, 100);
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImage} />
        <Text style={styles.userName}>{user?.fullName || 'Delivery Partner'}</Text>
        <Text style={styles.userId}>ID: {user?.id?.slice(-6).toUpperCase()}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ 4.8</Text>
          <Text style={styles.ratingCount}>(245 deliveries)</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>₹18.5K</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>145</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>385</Text>
          <Text style={styles.statLabel}>Total Km</Text>
        </View>
      </View>

      <View style={styles.vehicleCard}>
        <Text style={styles.vehicleTitle}>Vehicle Information</Text>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleLabel}>Type:</Text>
          <Text style={styles.vehicleValue}>Motorcycle</Text>
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleLabel}>Number:</Text>
          <Text style={styles.vehicleValue}>DL 01 AB 1234</Text>
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleLabel}>Model:</Text>
          <Text style={styles.vehicleValue}>Honda Activa</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="#dc2626" />
        ) : (
          <Text style={styles.logoutButtonText}>Logout</Text>
        )}
      </TouchableOpacity>
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
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rating: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: 12,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  vehicleCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  vehicleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  vehicleLabel: {
    fontSize: 14,
    color: '#666',
  },
  vehicleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 0,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 24,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  logoutButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});


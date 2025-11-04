// Pending Approval Screen - for shop owners and delivery partners awaiting admin approval
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { shopApi } from '@/services/api.helpers';

export default function PendingApprovalScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [shopExists, setShopExists] = useState(false);
  const [checkingShop, setCheckingShop] = useState(true);

  useEffect(() => {
    if (user?.role === 'shop_owner') {
      checkShopStatus();
    } else {
      setCheckingShop(false);
    }
  }, [user]);

  const checkShopStatus = async () => {
    try {
      const response = await shopApi.getMyShop();
      // Backend returns shop directly in data
      setShopExists(response.success && !!response.data);
    } catch (error) {
      setShopExists(false);
    } finally {
      setCheckingShop(false);
    }
  };

  const handleSetupShop = () => {
    router.push('/(shop)/setup');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (checkingShop) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  // If shop owner hasn't created shop yet
  if (user?.role === 'shop_owner' && !shopExists) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏪</Text>
        </View>

        <Text style={styles.title}>Complete Shop Setup</Text>
        <Text style={styles.subtitle}>
          You need to set up your shop with location details before it can be reviewed for approval.
        </Text>

        <View style={styles.messageBox}>
          <Text style={styles.messageTitle}>What you need:</Text>
          <Text style={styles.messageText}>• Shop name and description</Text>
          <Text style={styles.messageText}>• Shop category</Text>
          <Text style={styles.messageText}>• Contact details (phone & email)</Text>
          <Text style={styles.messageText}>• Complete shop address</Text>
          <Text style={styles.messageText}>• Location coordinates (auto-captured)</Text>
          <Text style={styles.messageText}>• Business hours</Text>
        </View>

        <TouchableOpacity style={styles.setupButton} onPress={handleSetupShop}>
          <Text style={styles.setupButtonText}>Set Up My Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⏳</Text>
      </View>

      <Text style={styles.title}>Pending Approval</Text>
      <Text style={styles.subtitle}>
        Your {user?.role === 'shop_owner' ? 'shop' : 'delivery partner account'} is being reviewed by our admin team.
      </Text>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{user?.fullName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>
            {user?.role === 'shop_owner' ? 'Shop Owner' : 'Delivery Partner'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Pending Review</Text>
          </View>
        </View>
      </View>

      <View style={styles.messageBox}>
        <Text style={styles.messageTitle}>What happens next?</Text>
        <Text style={styles.messageText}>
          • Our admin team will review your {user?.role === 'shop_owner' ? 'shop' : 'application'} within 24-48 hours
        </Text>
        <Text style={styles.messageText}>
          • You'll receive a notification once approved
        </Text>
        <Text style={styles.messageText}>
          • After approval, you can log in and start using all features
        </Text>
        {user?.role === 'shop_owner' && (
          <Text style={styles.messageText}>
            • You'll be able to add products and manage your shop
          </Text>
        )}
        {user?.role === 'delivery' && (
          <Text style={styles.messageText}>
            • You'll be able to accept delivery orders and earn money
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.contactButton}
        onPress={() => {/* Add contact support functionality */}}
      >
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
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
    color: '#f59e0b',
    fontWeight: '600',
  },
  messageBox: {
    width: '100%',
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 8,
    lineHeight: 20,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  contactButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  setupButton: {
    width: '100%',
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


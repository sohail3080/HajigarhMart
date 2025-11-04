import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const settingsSections = [
    {
      title: 'Platform Settings',
      items: [
        { id: 1, title: 'Commission Rates', icon: '💰', subtitle: 'Configure platform fees' },
        { id: 2, title: 'Delivery Charges', icon: '🚚', subtitle: 'Manage delivery pricing' },
        { id: 3, title: 'Service Areas', icon: '📍', subtitle: 'Define operational zones' },
      ],
    },
    {
      title: 'Shop Management',
      items: [
        { id: 4, title: 'Approval Settings', icon: '✅', subtitle: 'Shop verification rules' },
        { id: 5, title: 'Category Management', icon: '📦', subtitle: 'Product categories' },
        { id: 6, title: 'Shop Policies', icon: '📋', subtitle: 'Guidelines and rules' },
      ],
    },
    {
      title: 'System',
      items: [
        { id: 7, title: 'Notifications', icon: '🔔', subtitle: 'Push notification settings' },
        { id: 8, title: 'Maintenance Mode', icon: '🔧', subtitle: 'System maintenance' },
        { id: 9, title: 'App Version', icon: '📱', subtitle: 'v1.0.0' },
      ],
    },
    {
      title: 'Reports & Analytics',
      items: [
        { id: 10, title: 'Generate Reports', icon: '📊', subtitle: 'Download platform reports' },
        { id: 11, title: 'Export Data', icon: '💾', subtitle: 'Export user/order data' },
      ],
    },
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.adminAvatar} />
        <View style={styles.adminInfo}>
          <Text style={styles.adminName}>{user?.fullName || 'Admin'}</Text>
          <Text style={styles.adminEmail}>{user?.email}</Text>
          <Text style={styles.adminRole}>Platform Administrator</Text>
        </View>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.settingsGroup}>
            {section.items.map((item) => (
              <TouchableOpacity key={item.id} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Text style={styles.settingIcon}>{item.icon}</Text>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

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
    backgroundColor: '#1e40af',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  adminAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e40af',
    marginRight: 15,
  },
  adminInfo: {},
  adminName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  adminEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  adminRole: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  settingsGroup: {
    backgroundColor: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  settingArrow: {
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


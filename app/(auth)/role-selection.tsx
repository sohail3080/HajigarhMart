import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type UserRole = 'customer' | 'shop' | 'delivery';

interface RoleCard {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
}

const roles: RoleCard[] = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Browse and purchase products from local shops',
    icon: '🛒',
  },
  {
    id: 'shop',
    title: 'Shop Owner',
    description: 'List your products and manage your shop online',
    icon: '🏪',
  },
  {
    id: 'delivery',
    title: 'Delivery Partner',
    description: 'Deliver products and earn money',
    icon: '🚚',
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelection = (role: UserRole) => {
    // Navigate to registration with role
    router.push({
      pathname: '/(auth)/register',
      params: { role },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>Select how you want to use HajigarhMart</Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={styles.roleCard}
            onPress={() => handleRoleSelection(role.id)}
          >
            <Text style={styles.roleIcon}>{role.icon}</Text>
            <Text style={styles.roleTitle}>{role.title}</Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  rolesContainer: {
    gap: 15,
  },
  roleCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
});


// Root index - handles authentication routing
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isLoading || isNavigating) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Handle navigation in useEffect to avoid render-time navigation
    const handleNavigation = async () => {
      setIsNavigating(true);
      
      try {
        if (!isAuthenticated) {
          // User is not authenticated, redirect to welcome/login
          if (!inAuthGroup) {
            router.replace('/(auth)/welcome');
          }
        } else {
          // User is authenticated, redirect based on role
          if (inAuthGroup || segments.length === 0) {
            navigateToRoleHome();
          }
        }
      } finally {
        setIsNavigating(false);
      }
    };

    handleNavigation();
  }, [isAuthenticated, isLoading]);

  const navigateToRoleHome = () => {
    if (!user) return;

    // Check if user needs approval
    if (user.approvalStatus === 'pending') {
      router.replace('/(auth)/pending-approval');
      return;
    }

    if (user.approvalStatus === 'rejected') {
      router.replace('/(auth)/login');
      return;
    }

    // Navigate based on role
    switch (user.role) {
      case 'customer':
        router.replace('/(customer)/home');
        break;
      case 'shop':
      case 'shop_owner':
        router.replace('/(shop)/dashboard');
        break;
      case 'delivery':
        router.replace('/(delivery)/dashboard');
        break;
      case 'admin':
        router.replace('/(admin)/dashboard');
        break;
      default:
        router.replace('/(auth)/welcome');
    }
  };

  // Always show loading screen - navigation happens in useEffect
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2E7D32" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});


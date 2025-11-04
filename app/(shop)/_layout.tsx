import { Tabs, Stack, router, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ShopProvider, useShopContext } from '@/context/ShopContext';

function ShopLayoutContent() {
  const { shops, isLoading } = useShopContext();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const segments = useSegments();

  // Wait for shop context to finish loading
  useEffect(() => {
    if (!isLoading) {
      console.log('🏪 [SHOP LAYOUT] Shops loaded, count:', shops.length);
      setInitialCheckDone(true);
    }
  }, [isLoading, shops]);

  // Check if currently on setup page
  const isOnSetupPage = segments[segments.length - 1] === 'setup';

  // Handle redirects after initial check is done
  useEffect(() => {
    if (!initialCheckDone) return;
    
    const hasShops = shops.length > 0;
    console.log('🔄 [SHOP LAYOUT] Redirect check - hasShops:', hasShops, 'isOnSetupPage:', isOnSetupPage);
    
    // Only redirect to setup if no shops and not already there
    if (!hasShops && !isOnSetupPage) {
      console.log('🔀 [SHOP LAYOUT] No shops, redirecting to setup');
      router.replace('/(shop)/setup');
    }
    // Allow setup page access even with existing shops (for adding new shops)
    // Don't auto-redirect away from setup if shops exist
  }, [initialCheckDone, shops.length, isOnSetupPage]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  // If no shops, show only setup page with Stack layout
  if (shops.length === 0) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="setup" />
      </Stack>
    );
  }

  // Always use Tabs layout when shops exist (setup is hidden from tabs)
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="setup"
        options={{
          href: null, // Hide from tabs but accessible via router
          presentation: 'modal', // Present as modal when navigating to it
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'speedometer' : 'speedometer-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Wrap with ShopProvider
export default function ShopLayout() {
  return (
    <ShopProvider>
      <ShopLayoutContent />
    </ShopProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});


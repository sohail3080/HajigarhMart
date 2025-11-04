import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useNearbyShops } from '@/hooks/use-shops';
import * as Location from 'expo-location';

export default function ShopsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { shops, loading, error, refetch } = useNearbyShops(
    location?.latitude,
    location?.longitude,
    50 // 50 km radius
  );

  const categories = [
    { name: 'All', icon: '🏪' },
    { name: 'Grocery', icon: '🛒' },
    { name: 'Medical', icon: '💊' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Hardware', icon: '🔧' },
    { name: 'Stationery', icon: '📝' },
    { name: 'Restaurant', icon: '🍽️' },
    { name: 'Bakery', icon: '🍰' },
    { name: 'Other', icon: '🏬' },
  ];

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Failed to get location');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getLocation();
    await refetch();
    setRefreshing(false);
  };

  // Filter shops by search query and category
  const filteredShops = shops.filter((shop: any) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
    return matchesSearch && matchesCategory && shop.approvalStatus === 'approved' && shop.isActive;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Shops</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search shops..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryChip,
                selectedCategory === category.name && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.name)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.name && styles.categoryChipTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.shopsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {locationError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{locationError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={getLocation}>
              <Text style={styles.retryButtonText}>Enable Location</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredShops.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {shops.length === 0 
                ? 'No shops found nearby' 
                : 'No shops match your filters'}
            </Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or category
            </Text>
          </View>
        ) : (
          filteredShops.map((shop: any) => (
            <TouchableOpacity 
              key={shop._id} 
              style={styles.shopCard}
              onPress={() => router.push(`/(customer)/shop/${shop._id}` as any)}
            >
              <View style={styles.shopImage}>
                {shop.images?.[0] ? (
                  <Text style={styles.shopImagePlaceholder}>🏪</Text>
                ) : (
                  <Text style={styles.shopImagePlaceholder}>🏪</Text>
                )}
              </View>
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopCategory}>{shop.category}</Text>
                <View style={styles.shopMeta}>
                  <Text style={styles.shopRating}>
                    ⭐ {shop.rating?.toFixed(1) || '0.0'}
                  </Text>
                  {shop.distance && (
                    <Text style={styles.shopDistance}>
                      • {shop.distance.toFixed(1)} km
                    </Text>
                  )}
                  <Text style={styles.shopStatus}>• Open</Text>
                </View>
                <Text style={styles.shopDescription} numberOfLines={2}>
                  {shop.description || 'Quality products and services'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
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
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoriesWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoriesContainer: {
    flexGrow: 0,
  },
  categoriesContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    alignItems: 'center',
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryChipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
    elevation: 2,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  categoryChipText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  shopsContainer: {
    padding: 15,
  },
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopImagePlaceholder: {
    fontSize: 48,
  },
  loader: {
    marginTop: 50,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  shopInfo: {
    padding: 15,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  shopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopRating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  shopDistance: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  shopStatus: {
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: 4,
  },
  shopDescription: {
    fontSize: 12,
    color: '#999',
  },
});


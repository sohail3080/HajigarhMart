import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ShopsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Groceries', 'Electronics', 'Clothing', 'Medicines', 'Hardware'];

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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.shopsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((shop) => (
          <TouchableOpacity key={shop} style={styles.shopCard}>
            <View style={styles.shopImage} />
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>Local Shop {shop}</Text>
              <Text style={styles.shopCategory}>Groceries & Daily Needs</Text>
              <View style={styles.shopMeta}>
                <Text style={styles.shopRating}>⭐ 4.{shop}</Text>
                <Text style={styles.shopDistance}>• 0.{shop} km</Text>
                <Text style={styles.shopStatus}>• Open</Text>
              </View>
              <Text style={styles.shopDescription}>
                Fresh vegetables, groceries, and daily essentials
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#2E7D32',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
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


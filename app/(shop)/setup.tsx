import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { shopApi } from '@/services/api.helpers';
import { useAuth } from '@/context/AuthContext';
import { useShopContext } from '@/context/ShopContext';
import LocationPicker from '@/components/LocationPicker';

export default function ShopSetupScreen() {
  const { logout } = useAuth();
  const { refreshShops, shops } = useShopContext();
  const [loading, setLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const isAddingAdditionalShop = shops.length > 0;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Grocery',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    latitude: 0,
    longitude: 0,
    openTime: '09:00',
    closeTime: '21:00',
  });

  const categories = [
    'Grocery', 'Medical', 'Electronics', 'Clothing', 
    'Hardware', 'Stationery', 'Restaurant', 'Bakery', 'Other'
  ];

  const handleLocationSelect = (location: { 
    latitude: number; 
    longitude: number; 
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      // Auto-fill address fields from location
      street: location.street || prev.street,
      city: location.city || prev.city,
      state: location.state || prev.state,
      pincode: location.pincode || prev.pincode,
    }));
    setShowLocationPicker(false);
    Alert.alert(
      'Location Selected!', 
      'Address details have been auto-filled. You can edit any field if needed.',
      [{ text: 'OK' }]
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Shop name is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Shop description is required');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    }
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      Alert.alert('Error', 'Complete address is required');
      return false;
    }
    if (formData.latitude === 0 || formData.longitude === 0) {
      Alert.alert('Error', 'Location coordinates are required. Please enable location.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const shopData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          landmark: formData.landmark.trim(),
          coordinates: {
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
        },
        timings: {
          openTime: formData.openTime,
          closeTime: formData.closeTime,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
      };

      const response = await shopApi.createShop(shopData);
      if (response.success) {
        // Refresh shops list
        await refreshShops();
        
        Alert.alert(
          'Shop Created Successfully!',
          'Your shop has been created. You can now manage it from the dashboard.',
          [{ 
            text: 'OK', 
            onPress: () => {
              // Redirect to dashboard
              router.replace('/(shop)/dashboard');
            }
          }]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to register shop');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to register shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            {isAddingAdditionalShop && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  // Try to go back, if not possible, navigate to dashboard
                  try {
                    if (router.canGoBack()) {
                      router.back();
                    } else {
                      router.push('/(shop)/dashboard');
                    }
                  } catch (error) {
                    console.log('Navigation error, going to dashboard');
                    router.push('/(shop)/dashboard');
                  }
                }}
              >
                <Text style={styles.backText}>✕ Close</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.title}>
              {isAddingAdditionalShop ? 'Add New Shop' : 'Complete Shop Setup'}
            </Text>
            <Text style={styles.subtitle}>
              {isAddingAdditionalShop 
                ? `You have ${shops.length} shop${shops.length > 1 ? 's' : ''}. Add another one below.`
                : 'Fill in your shop details to get started'
              }
            </Text>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={async () => {
                await logout();
                router.replace('/(auth)/login');
              }}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shop Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter shop name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your shop"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    formData.category === category && styles.categoryChipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, category })}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === category && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email (optional)"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <Text style={styles.sectionTitle}>Address Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street/Area *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter street address"
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
              editable={!loading}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="City (auto-filled from map)"
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                editable={!loading}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>State * 🔒</Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                placeholder="Auto-filled from map"
                value={formData.state}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Pincode * 🔒</Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                placeholder="Auto-filled from map"
                value={formData.pincode}
                keyboardType="number-pad"
                editable={false}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Landmark</Text>
              <TextInput
                style={styles.input}
                placeholder="Nearby landmark"
                value={formData.landmark}
                onChangeText={(text) => setFormData({ ...formData, landmark: text })}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.locationBox}>
            <Text style={styles.locationLabel}>📍 Shop Location (Required) *</Text>
            {formData.latitude !== 0 && formData.longitude !== 0 ? (
              <>
                <Text style={styles.locationText}>
                  ✓ Location Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </Text>
                <TouchableOpacity
                  style={styles.selectLocationButton}
                  onPress={() => setShowLocationPicker(true)}
                >
                  <Text style={styles.selectLocationText}>📍 Change Location on Map</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.locationWarning}>
                  ⚠️ You must select your shop's exact location on the map
                </Text>
                <TouchableOpacity
                  style={styles.selectLocationButtonPrimary}
                  onPress={() => setShowLocationPicker(true)}
                >
                  <Text style={styles.selectLocationTextPrimary}>🗺️ Select Location on Map</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Location Picker Modal */}
          <Modal
            visible={showLocationPicker}
            animationType="slide"
            onRequestClose={() => setShowLocationPicker(false)}
          >
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              initialLocation={
                formData.latitude !== 0 && formData.longitude !== 0
                  ? { latitude: formData.latitude, longitude: formData.longitude }
                  : undefined
              }
            />
          </Modal>

          <Text style={styles.sectionTitle}>Business Hours</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Opening Time</Text>
              <TextInput
                style={styles.input}
                placeholder="09:00"
                value={formData.openTime}
                onChangeText={(text) => setFormData({ ...formData, openTime: text })}
                editable={!loading}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Closing Time</Text>
              <TextInput
                style={styles.input}
                placeholder="21:00"
                value={formData.closeTime}
                onChangeText={(text) => setFormData({ ...formData, closeTime: text })}
                editable={!loading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
  flex: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoryChipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  locationBox: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  locationWarning: {
    fontSize: 14,
    color: '#f59e0b',
    marginBottom: 10,
    fontWeight: '500',
  },
  selectLocationButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
    alignItems: 'center',
    marginTop: 8,
  },
  selectLocationText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  selectLocationButtonPrimary: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  selectLocationTextPrimary: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    marginBottom: 15,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    marginBottom: 15,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  fieldHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
});


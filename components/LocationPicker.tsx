import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_PLACES_API_KEY = 'AIzaSyApVrg7NgcSbI-EqQcxEQw0f-cvtal-IP4';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [region, setRegion] = useState({
    latitude: initialLocation?.latitude || 23.0225,
    longitude: initialLocation?.longitude || 72.5714,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: initialLocation?.latitude || 23.0225,
    longitude: initialLocation?.longitude || 72.5714,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'We need location permission to help you find your shop location on the map.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (!initialLocation) {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setMarkerCoordinate({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      getAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const [addressDetails, setAddressDetails] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results.length > 0) {
        const result = results[0];
        const addressStr = `${result.name || ''} ${result.street || ''}, ${result.city || ''}, ${result.region || ''}`.trim();
        setAddress(addressStr);
        
        // Extract structured address details
        setAddressDetails({
          street: result.street || result.name || '',
          city: result.city || '',
          state: result.region || '',
          pincode: result.postalCode || '',
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&components=country:in`
      );
      const data = await response.json();
      
      if (data.predictions) {
        setSuggestions(data.predictions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Get place details and navigate to it
  const selectSuggestion = async (placeId: string, description: string) => {
    try {
      setLoading(true);
      setShowSuggestions(false);
      setSearchQuery(description);
      
      // Get place details
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      
      if (data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        setMarkerCoordinate({
          latitude: lat,
          longitude: lng,
        });
        getAddressFromCoordinates(lat, lng);
      }
    } catch (error) {
      console.error('Error selecting suggestion:', error);
      Alert.alert('Error', 'Failed to select location');
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a location to search');
      return;
    }

    try {
      setLoading(true);
      setShowSuggestions(false);
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const result = results[0];
        const newRegion = {
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        setMarkerCoordinate({
          latitude: result.latitude,
          longitude: result.longitude,
        });
        getAddressFromCoordinates(result.latitude, result.longitude);
      } else {
        Alert.alert('Not Found', 'Location not found. Please try a different search.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      Alert.alert('Error', 'Failed to search location');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    setMarkerCoordinate(coordinate);
    getAddressFromCoordinates(coordinate.latitude, coordinate.longitude);
  };

  const confirmLocation = () => {
    onLocationSelect({
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude,
      address: address,
      street: addressDetails.street,
      city: addressDetails.city,
      state: addressDetails.state,
      pincode: addressDetails.pincode,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for your shop location..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowSuggestions(true);
              fetchSuggestions(text);
            }}
            onSubmitEditing={searchLocation}
            onFocus={() => setShowSuggestions(true)}
          />
          {loading && <ActivityIndicator size="small" color="#2E7D32" />}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchLocation}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectSuggestion(item.place_id, item.description)}
              >
                <Ionicons name="location-outline" size={20} color="#666" />
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionMainText}>
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.suggestionSecondaryText}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={(e) => {
          setShowSuggestions(false);
          handleMapPress(e);
        }}
      >
        <Marker
          coordinate={markerCoordinate}
          draggable
          onDragEnd={(e) => {
            const coordinate = e.nativeEvent.coordinate;
            setMarkerCoordinate(coordinate);
            getAddressFromCoordinates(coordinate.latitude, coordinate.longitude);
          }}
        >
          <View style={styles.markerContainer}>
            <Ionicons name="location" size={40} color="#2E7D32" />
          </View>
        </Marker>
      </MapView>

      {/* Location Info */}
      <View style={styles.locationInfo}>
        <View style={styles.infoHeader}>
          <Ionicons name="location-outline" size={24} color="#2E7D32" />
          <Text style={styles.infoTitle}>Selected Location</Text>
        </View>
        
        {address ? (
          <Text style={styles.addressText}>{address}</Text>
        ) : (
          <Text style={styles.addressPlaceholder}>Tap on the map to select location</Text>
        )}
        
        <Text style={styles.coordinates}>
          Lat: {markerCoordinate.latitude.toFixed(6)}, Lng: {markerCoordinate.longitude.toFixed(6)}
        </Text>

        {/* Address Details */}
        {addressDetails.city && (
          <View style={styles.addressDetailsBox}>
            <Text style={styles.addressDetailsTitle}>📍 Address Details:</Text>
            {addressDetails.street && (
              <Text style={styles.addressDetailText}>Street: {addressDetails.street}</Text>
            )}
            {addressDetails.city && (
              <Text style={styles.addressDetailText}>City: {addressDetails.city}</Text>
            )}
            {addressDetails.state && (
              <Text style={styles.addressDetailText}>State: {addressDetails.state}</Text>
            )}
            {addressDetails.pincode && (
              <Text style={styles.addressDetailText}>Pincode: {addressDetails.pincode}</Text>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
            disabled={loading}
          >
            <Ionicons name="navigate" size={20} color="#2E7D32" />
            <Text style={styles.currentLocationText}>Use Current Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmLocation}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          💡 Tap on the map or drag the marker to select your shop's exact location
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  locationInfo: {
    backgroundColor: '#fff',
    padding: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  addressPlaceholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  currentLocationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  currentLocationText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  instructions: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ffc107',
  },
  instructionText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 70,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 300,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontSize: 12,
    color: '#666',
  },
  addressDetailsBox: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  addressDetailsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  addressDetailText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
  },
});


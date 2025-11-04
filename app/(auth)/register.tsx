import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Additional fields based on role
    shopName: '',
    address: '',
    vehicleNumber: '',
    vehicleType: 'bike',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    // Role-specific validation
    if (role === 'shop' && !formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
      isValid = false;
    }

    if (role === 'shop' && !formData.address.trim()) {
      newErrors.address = 'Shop address is required';
      isValid = false;
    }

    if (role === 'delivery' && !formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Map frontend role to backend role format
      const roleMap: { [key: string]: UserRole } = {
        'customer': 'customer',
        'shop': 'shop_owner',
        'delivery': 'delivery',
      };

      const backendRole = roleMap[role as string] || 'customer';

      // Prepare registration data
      const registrationData: any = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: backendRole,
      };

      // Add role-specific fields
      if (role === 'delivery') {
        registrationData.vehicleType = formData.vehicleType;
        registrationData.vehicleNumber = formData.vehicleNumber.trim();
      }

      // Add basic address for all users
      if (formData.address.trim()) {
        registrationData.address = {
          street: formData.address.trim(),
          city: 'Hajigarh', // Default city
          state: 'State', // Default state
          pincode: '123456', // Default pincode
        };
      }

      const result = await register(registrationData);

      if (result.success) {
        Alert.alert(
          'Registration Successful',
          role === 'shop' || role === 'delivery'
            ? 'Your account has been created and is pending admin approval.'
            : 'Your account has been created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to root which will handle role-based routing
                router.replace('/');
              },
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'customer': return 'Customer';
      case 'shop': return 'Shop Owner';
      case 'delivery': return 'Delivery Partner';
      default: return 'User';
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Register as {getRoleTitle()}</Text>
          </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.fullName ? styles.inputError : null]}
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(text) => {
              setFormData({ ...formData, fullName: text });
              setErrors({ ...errors, fullName: '' });
            }}
            editable={!loading}
          />
          {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              setErrors({ ...errors, email: '' });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            placeholder="Enter your phone number (10 digits)"
            value={formData.phone}
            onChangeText={(text) => {
              setFormData({ ...formData, phone: text });
              setErrors({ ...errors, phone: '' });
            }}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!loading}
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        </View>

        {role === 'shop' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Name</Text>
              <TextInput
                style={[styles.input, errors.shopName ? styles.inputError : null]}
                placeholder="Enter your shop name"
                value={formData.shopName}
                onChangeText={(text) => {
                  setFormData({ ...formData, shopName: text });
                  setErrors({ ...errors, shopName: '' });
                }}
                editable={!loading}
              />
              {errors.shopName ? <Text style={styles.errorText}>{errors.shopName}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Address</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.address ? styles.inputError : null,
                ]}
                placeholder="Enter your shop address"
                value={formData.address}
                onChangeText={(text) => {
                  setFormData({ ...formData, address: text });
                  setErrors({ ...errors, address: '' });
                }}
                multiline
                numberOfLines={3}
                editable={!loading}
              />
              {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
            </View>
          </>
        )}

        {role === 'delivery' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Number</Text>
            <TextInput
              style={[styles.input, errors.vehicleNumber ? styles.inputError : null]}
              placeholder="Enter your vehicle number (e.g., DL01AB1234)"
              value={formData.vehicleNumber}
              onChangeText={(text) => {
                setFormData({ ...formData, vehicleNumber: text });
                setErrors({ ...errors, vehicleNumber: '' });
              }}
              autoCapitalize="characters"
              editable={!loading}
            />
            {errors.vehicleNumber ? (
              <Text style={styles.errorText}>{errors.vehicleNumber}</Text>
            ) : null}
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            placeholder="Create a password (min. 6 characters)"
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              setErrors({ ...errors, password: '' });
            }}
            secureTextEntry
            editable={!loading}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData({ ...formData, confirmPassword: text });
              setErrors({ ...errors, confirmPassword: '' });
            }}
            secureTextEntry
            editable={!loading}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading ? styles.registerButtonDisabled : null]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  registerButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 52,
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
});


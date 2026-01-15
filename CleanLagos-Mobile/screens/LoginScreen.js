import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux-store/src/slices/authSlice';
import { validatePhoneNumber, validatePassword } from '../utils/validation';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Clear previous validation errors
    setValidationErrors({});
    
    // Validate inputs
    const phoneValidation = validatePhoneNumber(phone);
    const passwordValidation = validatePassword(password);
    
    const errors = {};
    if (!phoneValidation.valid) errors.phone = phoneValidation.message;
    if (!passwordValidation.valid) errors.password = passwordValidation.message;
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Alert.alert('Validation Error', Object.values(errors)[0]);
      return;
    }

    try {
      const result = await dispatch(loginUser({ phone, password })).unwrap();
      console.log('✅ Login successful:', result.user.fullName);
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.title}>CleanLagos</Text>
          <Text style={styles.subtitle}>Report. Track. Earn Points.</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error.message || 'Login failed'}</Text>
          </View>
        )}

        <View style={styles.form}>
          <TextInput
            style={[styles.input, validationErrors.phone && styles.inputError]}
            placeholder="Phone Number (e.g., 08012345678)"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (validationErrors.phone) {
                setValidationErrors(prev => ({ ...prev, phone: null }));
              }
            }}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            editable={!loading}
          />
          {validationErrors.phone && (
            <Text style={styles.validationError}>{validationErrors.phone}</Text>
          )}

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, validationErrors.password && styles.inputError]}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (validationErrors.password) {
                  setValidationErrors(prev => ({ ...prev, password: null }));
                }
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
              editable={!loading}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {validationErrors.password && (
            <Text style={styles.validationError}>{validationErrors.password}</Text>
          )}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.linkText}>Don't have an account? Register</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkButton, { marginTop: 10 }]}
            onPress={() => {
              if (phone) {
                navigation.navigate('VerifyPhone', { phone });
              } else {
                Alert.alert('Enter Phone Number', 'Please enter your phone number above, then tap this link.');
              }
            }}
            disabled={loading}
          >
            <Text style={[styles.linkText, { fontSize: 12, color: '#666' }]}>
              Need to verify your phone?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 5,
  },
  passwordInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    paddingRight: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  eyeIconText: {
    fontSize: 20,
  },
  inputError: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  validationError: {
    color: '#F44336',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
});

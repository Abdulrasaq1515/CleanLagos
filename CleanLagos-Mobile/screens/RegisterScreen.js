import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux-store/src/slices/authSlice';
import { validatePhoneNumber, validatePassword, validateEmail, validateFullName } from '../utils/validation';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen'
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    const nameValidation = validateFullName(formData.fullName);
    if (!nameValidation.valid) errors.fullName = nameValidation.message;
    
    const phoneValidation = validatePhoneNumber(formData.phone);
    if (!phoneValidation.valid) errors.phone = phoneValidation.message;
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) errors.email = emailValidation.message;
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) errors.password = passwordValidation.message;
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleRegister = async () => {
    setValidationErrors({});
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Alert.alert('Validation Error', Object.values(errors)[0]);
      return;
    }

    try {
      const result = await dispatch(registerUser({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })).unwrap();
      
      // Show verification code if returned (development only)
      const message = result.verificationCode 
        ? `Registration successful!\n\nVerification Code: ${result.verificationCode}\n\nEnter this code on the next screen.`
        : 'Registration successful! Please check your phone for verification code.';
      
      Alert.alert(
        'Registration Successful',
        message,
        [{ text: 'OK', onPress: () => navigation.navigate('VerifyPhone', { phone: formData.phone }) }]
      );
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Please try again');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join CleanLagos today</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error.message || 'Registration failed'}</Text>
          </View>
        )}

        <View style={styles.form}>
          <TextInput
            style={[styles.input, validationErrors.fullName && styles.inputError]}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => updateField('fullName', text)}
            editable={!loading}
          />
          {validationErrors.fullName && (
            <Text style={styles.validationError}>{validationErrors.fullName}</Text>
          )}

          <TextInput
            style={[styles.input, validationErrors.phone && styles.inputError]}
            placeholder="Phone Number (08012345678)"
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            keyboardType="phone-pad"
            editable={!loading}
          />
          {validationErrors.phone && (
            <Text style={styles.validationError}>{validationErrors.phone}</Text>
          )}

          <TextInput
            style={[styles.input, validationErrors.email && styles.inputError]}
            placeholder="Email (optional)"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          {validationErrors.email && (
            <Text style={styles.validationError}>{validationErrors.email}</Text>
          )}

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, validationErrors.password && styles.inputError]}
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              secureTextEntry={!showPassword}
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

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, validationErrors.confirmPassword && styles.inputError]}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIconText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {validationErrors.confirmPassword && (
            <Text style={styles.validationError}>{validationErrors.confirmPassword}</Text>
          )}

          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.roleButtons}>
            {['citizen', 'psp', 'recycler'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleButton,
                  formData.role === role && styles.roleButtonActive
                ]}
                onPress={() => updateField('role', role)}
                disabled={loading}
              >
                <Text style={[
                  styles.roleButtonText,
                  formData.role === role && styles.roleButtonTextActive
                ]}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
  roleButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#2e7d32',
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
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
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
});

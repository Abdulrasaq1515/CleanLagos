import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, addNotification } from '../../store';

export default function ForgotPasswordScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading, passwordResetSent } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');


const handleResetPassword = async () => {
  if (!email.trim()) {
    Alert.alert('Error', 'Please enter your email address');
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  const result = await dispatch(resetPassword(email));

  if (resetPassword.fulfilled.match(result)) {
    dispatch(
      addNotification({
        type: 'success',
        message: 'Password reset link sent to your email',
        duration: 5000,
      })
    );
    
    // For testing: Navigate directly to ResetPassword screen
    // In production, user would click email link which contains the reset token
    Alert.alert(
      'Success',
      'Password reset instructions sent to your email. For testing, we\'ll take you to the reset password screen.',
      [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('ResetPassword', { 
            email: email,
            resetToken: 'mock_token_123' // In production, this comes from email link
          }),
        },
      ]
    );
  }
};
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your password
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.resetButton, isLoading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToLoginButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 100,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    lineHeight: 24,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  resetButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#81C784',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginButton: {
    alignItems: 'center',
    padding: 10,
  },
  backToLoginText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
});
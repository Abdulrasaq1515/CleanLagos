import React, { useState, useRef, useEffect } from 'react';
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
import { verifyOTP, sendOTP, addNotification } from '../../store';

export default function OTPVerificationScreen({ route, navigation }) {
  const { phone } = route.params;
  const dispatch = useDispatch();
  const { isLoading, otpVerified } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (otpVerified) {
      navigation.navigate('Login');
    }
  }, [otpVerified, navigation]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (index === 3 && value) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = async (otpCode = null) => {
    const code = otpCode || otp.join('');

    if (code.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP');
      return;
    }

    const result = await dispatch(verifyOTP({ phone, otp: code }));

    if (verifyOTP.fulfilled.match(result)) {
      dispatch(
        addNotification({
          type: 'success',
          message: 'Phone number verified successfully!',
        })
      );
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '']);
      inputRefs[0].current.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    const result = await dispatch(sendOTP(phone));

    if (sendOTP.fulfilled.match(result)) {
      dispatch(
        addNotification({
          type: 'success',
          message: 'OTP resent successfully',
        })
      );
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs[0].current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <Ionicons name="phone-portrait" size={64} color="#2E7D32" />
      </View>

      <Text style={styles.title}>Verify Phone Number</Text>
      <Text style={styles.subtitle}>
        Enter the 4-digit code sent to {'\n'}
        <Text style={styles.phone}>{phone}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            editable={!isLoading}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, isLoading && styles.disabledButton]}
        onPress={() => handleVerify()}
        disabled={isLoading || otp.join('').length !== 4}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyButtonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>
            Resend OTP in {timer}s
          </Text>
        )}
      </View>

      <Text style={styles.helpText}>
        Hint: Use "1234" as OTP for testing
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
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
  iconContainer: {
    marginTop: 100,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  phone: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  verifyButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#81C784',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  timerText: {
    color: '#666',
    fontSize: 14,
  },
  helpText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
  },
});
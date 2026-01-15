import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportScreen() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!description || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    Alert.alert('Success', 'Report submitted! (Feature coming soon)');
    setDescription('');
    setLocation('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Report Waste</Text>
        <Text style={styles.subtitle}>Help keep Lagos clean by reporting waste</Text>

        <View style={styles.form}>
          <TouchableOpacity style={styles.photoButton}>
            <Text style={styles.photoIcon}>📸</Text>
            <Text style={styles.photoText}>Take Photo</Text>
            <Text style={styles.photoSubtext}>(Coming soon)</Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location or use GPS"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the waste issue..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Report</Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  photoIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  photoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  photoSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

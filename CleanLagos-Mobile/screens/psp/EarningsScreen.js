import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EarningsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Earnings</Text>
        <Text style={styles.subtitle}>Track your collection earnings</Text>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsValue}>₦0.00</Text>
          <Text style={styles.earningsSubtext}>This month</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earning Breakdown</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>✅</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Completed Tasks</Text>
              <Text style={styles.infoText}>0 tasks</Text>
            </View>
            <Text style={styles.infoAmount}>₦0.00</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⭐</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Bonus</Text>
              <Text style={styles.infoText}>Performance bonus</Text>
            </View>
            <Text style={styles.infoAmount}>₦0.00</Text>
          </View>
        </View>

        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>💰 Payment history coming soon!</Text>
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
    color: '#2196F3',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  earningsCard: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 10,
  },
  earningsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  earningsSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  infoAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  comingSoon: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
});

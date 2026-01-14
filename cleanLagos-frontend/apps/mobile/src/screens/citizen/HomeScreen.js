import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { 
  logout, 
  fetchMyReports,
  addNotification 
} from '../../store';

export default function CitizenHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myReports, isLoading } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchMyReports());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addNotification({
      type: 'info',
      message: 'Logged out successfully'
    }));
  };

  const handleReportWaste = () => {
    navigation.navigate('Report');
  };

  const handleRefresh = () => {
    dispatch(fetchMyReports());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.fullName || 'Citizen'}! 👋</Text>
          <Text style={styles.points}>🌿 {user?.points || 0} Clean Points</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.mainAction}
          onPress={handleReportWaste}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="camera" size={32} color="#fff" />
          </View>
          <Text style={styles.actionText}>Report Waste</Text>
          <Text style={styles.actionSubtext}>Snap & Submit</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="trophy" size={24} color="#2E7D32" />
            <Text style={styles.secondaryActionText}>Rewards</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="notifications" size={24} color="#2E7D32" />
            <Text style={styles.secondaryActionText}>Alerts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="map" size={24} color="#2E7D32" />
            <Text style={styles.secondaryActionText}>Heatmap</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* My Reports Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Reports</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
        ) : (
          <ScrollView 
            style={styles.reportsList}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
                colors={['#2E7D32']}
              />
            }
          >
            {myReports.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No reports yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Report waste to earn points and help clean Lagos!
                </Text>
              </View>
            ) : (
              myReports.map((report) => (
                <TouchableOpacity key={report.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <View style={[styles.statusBadge, 
                      report.status === 'pending' && styles.statusPending,
                      report.status === 'verified' && styles.statusVerified,
                      report.status === 'completed' && styles.statusCompleted
                    ]}>
                      <Text style={styles.statusText}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.reportDate}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <Text style={styles.reportLocation} numberOfLines={1}>
                     {report.location.address}
                  </Text>
                  
                  {report.description && (
                    <Text style={styles.reportDescription} numberOfLines={2}>
                      {report.description}
                    </Text>
                  )}
                  
                  <View style={styles.reportFooter}>
                    <Text style={styles.pointsBadge}>
                      +{report.pointsAwarded || 10} points
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  points: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  actions: {
    padding: 20,
    backgroundColor: '#fff',
  },
  mainAction: {
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryAction: {
    alignItems: 'center',
    padding: 10,
  },
  secondaryActionText: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 4,
  },
  section: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reportsList: {
    flex: 1,
  },
  reportCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusVerified: {
    backgroundColor: '#E3F2FD',
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
  },
  reportLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsBadge: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
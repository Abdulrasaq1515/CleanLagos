import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import {
  logout,
  addNotification,
  fetchMyTasks,
  acceptTask,
  fetchTaskHistory,
} from '../../store';

export default function PspHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, earnings, stats, taskHistory } = useSelector((state) => state.psp);
  
  const [activeTab, setActiveTab] = useState('tasks');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await dispatch(fetchMyTasks());
    await dispatch(fetchTaskHistory());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addNotification({
      type: 'info',
      message: 'Logged out successfully'
    }));
  };

  const handleAcceptTask = async (taskId) => {
    const result = await dispatch(acceptTask(taskId));
    if (acceptTask.fulfilled.match(result)) {
      dispatch(addNotification({
        type: 'success',
        message: 'Task accepted! Navigate to location to begin.'
      }));
    }
  };

  const handleViewTask = (task) => {
    navigation.navigate('TaskDetail', { task });
  };

  const handleCompleteTask = (taskId) => {
    navigation.navigate('CompleteTask', { taskId });
  };

  const handleNavigateToTask = (location) => {
    // In real app, this would open Google Maps or Apple Maps
    const { lat, lng } = location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    console.log('Opening navigation to:', url);
    dispatch(addNotification({
      type: 'info',
      message: 'Opening navigation to task location'
    }));
  };

  // Calculate stats
  const pendingTasks = tasks.filter(t => t.status === 'assigned');
  const acceptedTasks = tasks.filter(t => t.status === 'accepted');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return '#2196F3';
      case 'accepted': return '#FF9800';
      case 'completed': return '#4CAF50';
      default: return '#666';
    }
  };

  // Render task item
  const renderTaskItem = (task) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskCard}
      onPress={() => handleViewTask(task)}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskBadges}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
            <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={styles.statusText}>{task.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.taskPoints}>+{task.pointsValue} pts</Text>
      </View>

      <Text style={styles.taskLocation} numberOfLines={1}>
        📍 {task.location.address}
      </Text>

      <Text style={styles.taskDescription} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.taskDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.detailText}>{task.estimatedTime} min</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="trash" size={16} color="#666" />
          <Text style={styles.detailText}>{task.wasteType}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            Due: {new Date(task.deadline).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.taskActions}>
        {task.status === 'assigned' && (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptTask(task.id)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.acceptButtonText}>Accept Task</Text>
          </TouchableOpacity>
        )}

        {task.status === 'accepted' && (
          <>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => handleNavigateToTask(task.location)}
            >
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.navigateButtonText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleCompleteTask(task.id)}
            >
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          </>
        )}

        {task.status === 'completed' && (
          <View style={styles.completedTag}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.completedText}>Completed</Text>
            <Text style={styles.completedTime}>
              {new Date(task.completedAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, {user?.fullName || 'PSP Worker'}! 👷</Text>
          <Text style={styles.company}>Clean Team Lagos</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
      >
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completedToday}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingTasks.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₦{earnings.today.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{earnings.totalPoints.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => setActiveTab('tasks')}
        >
          <Ionicons 
            name="list" 
            size={20} 
            color={activeTab === 'tasks' ? '#2196F3' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>
            Tasks ({tasks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
        >
          <Ionicons 
            name="map" 
            size={20} 
            color={activeTab === 'map' ? '#2196F3' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'earnings' && styles.activeTab]}
          onPress={() => setActiveTab('earnings')}
        >
          <Ionicons 
            name="cash" 
            size={20} 
            color={activeTab === 'earnings' ? '#2196F3' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'earnings' && styles.activeTabText]}>
            Earnings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      <View style={styles.content}>
        {isLoading && activeTab === 'tasks' ? (
          <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
        ) : activeTab === 'tasks' ? (
          <ScrollView
            style={styles.tasksList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2196F3']}
              />
            }
          >
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>New Assignments ({pendingTasks.length})</Text>
                {pendingTasks.map(renderTaskItem)}
              </>
            )}

            {/* Accepted Tasks */}
            {acceptedTasks.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>In Progress ({acceptedTasks.length})</Text>
                {acceptedTasks.map(renderTaskItem)}
              </>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Recently Completed ({completedTasks.length})</Text>
                {completedTasks.map(renderTaskItem)}
              </>
            )}

            {tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-done-circle" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No tasks assigned</Text>
                <Text style={styles.emptyStateSubtext}>
                  New tasks will appear here when assigned by LAWMA
                </Text>
              </View>
            )}
          </ScrollView>
        ) : activeTab === 'map' ? (
          <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Task Locations</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 6.5244,
                longitude: 3.3792,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {tasks.map((task) => (
                <Marker
                  key={task.id}
                  coordinate={task.location.coordinates}
                  title={task.location.address}
                  description={`${task.wasteType} - ${task.status}`}
                >
                  <View style={[
                    styles.mapMarker,
                    { backgroundColor: getStatusColor(task.status) }
                  ]}>
                    <Ionicons 
                      name={
                        task.status === 'completed' ? 'checkmark' :
                        task.status === 'accepted' ? 'navigate' : 'alert'
                      } 
                      size={16} 
                      color="#fff" 
                    />
                  </View>
                </Marker>
              ))}
            </MapView>
          </View>
        ) : activeTab === 'earnings' ? (
          <ScrollView style={styles.earningsContainer}>
            <View style={styles.earningsSummary}>
              <Text style={styles.earningsTitle}>Earnings Summary</Text>
              <View style={styles.earningRow}>
                <Text style={styles.earningLabel}>Today</Text>
                <Text style={styles.earningValue}>₦{earnings.today.toLocaleString()}</Text>
              </View>
              <View style={styles.earningRow}>
                <Text style={styles.earningLabel}>This Week</Text>
                <Text style={styles.earningValue}>₦{earnings.week.toLocaleString()}</Text>
              </View>
              <View style={styles.earningRow}>
                <Text style={styles.earningLabel}>This Month</Text>
                <Text style={styles.earningValue}>₦{earnings.month.toLocaleString()}</Text>
              </View>
              <View style={styles.earningRow}>
                <Text style={styles.earningLabel}>Total Points</Text>
                <Text style={styles.earningValue}>{earnings.totalPoints.toLocaleString()}</Text>
              </View>
            </View>

            <Text style={styles.historyTitle}>Recent Completions</Text>
            {taskHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyTask}>Task {item.id}</Text>
                  <Text style={styles.historyTime}>
                    {new Date(item.completedAt).toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.historyPoints}>+{item.pointsEarned} pts</Text>
              </View>
            ))}
          </ScrollView>
        ) : null}
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
  company: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  statsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  statCard: {
    width: 100,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#2196F3',
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 50,
  },
  tasksList: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  taskPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  taskLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  navigateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9C27B0',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  completedTag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  completedTime: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
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
  mapContainer: {
    flex: 1,
    padding: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  map: {
    flex: 1,
    borderRadius: 12,
  },
  mapMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsContainer: {
    flex: 1,
    padding: 20,
  },
  earningsSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  earningLabel: {
    fontSize: 14,
    color: '#666',
  },
  earningValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  historyIcon: {
    marginRight: 15,
  },
  historyDetails: {
    flex: 1,
  },
  historyTask: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
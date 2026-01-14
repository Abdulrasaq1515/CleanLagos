import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  logout,
  addNotification,
  fetchRecyclingTasks,
} from '../../store';

const RecyclerHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, stats, materials } = useSelector((state) => state.recycler);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    await dispatch(fetchRecyclingTasks());
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addNotification({
      type: 'info',
      message: 'Logged out successfully'
    }));
  };

  const handleRefresh = () => {
    loadTasks();
  };

  const handleViewTask = (task) => {
    navigation.navigate('RecycleTaskDetail', { task });
  };

  const handleCompleteTask = (taskId) => {
    navigation.navigate('CompleteRecycling', { taskId });
  };

  const getMaterialColor = (type) => {
    switch (type) {
      case 'plastic': return '#2196F3';
      case 'electronic': return '#9C27B0';
      case 'organic': return '#4CAF50';
      case 'metal': return '#FF9800';
      default: return '#666';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'in_progress': return '#2196F3';
      case 'completed': return '#4CAF50';
      default: return '#666';
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, {user?.fullName || 'Recycler'}! ♻️</Text>
          <Text style={styles.company}>Green Recycling Lagos</Text>
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
          <Text style={styles.statValue}>{stats.totalRecycled.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Kg Recycled</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPoints.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.tasksCompleted}</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.efficiency}%</Text>
          <Text style={styles.statLabel}>Efficiency</Text>
        </View>
      </ScrollView>

      {/* Materials Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materials Recycled</Text>
        <View style={styles.materialsGrid}>
          {materials.map((material) => (
            <View key={material.type} style={styles.materialCard}>
              <View style={[styles.materialIcon, { backgroundColor: getMaterialColor(material.type) }]}>
                <Ionicons 
                  name={
                    material.type === 'plastic' ? 'water' :
                    material.type === 'electronic' ? 'hardware-chip' :
                    material.type === 'organic' ? 'leaf' : 'construct'
                  } 
                  size={24} 
                  color="#fff" 
                />
              </View>
              <Text style={styles.materialType}>{material.type}</Text>
              <Text style={styles.materialWeight}>{material.recycled.toFixed(1)} kg</Text>
              <Text style={styles.materialPoints}>{material.points.toLocaleString()} pts</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tasks List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recycling Tasks</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
        ) : (
          <ScrollView
            style={styles.tasksList}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
                colors={['#4CAF50']}
              />
            }
          >
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <>
                <Text style={styles.taskSectionTitle}>Pending ({pendingTasks.length})</Text>
                {pendingTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskCard}
                    onPress={() => handleViewTask(task)}
                  >
                    <View style={styles.taskHeader}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                        <Text style={styles.statusText}>PENDING</Text>
                      </View>
                      <Text style={styles.taskPoints}>+{task.points} pts</Text>
                    </View>
                    <Text style={styles.taskType}>
                      ♻️ {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Text>
                    <Text style={styles.taskLocation}>📍 {task.location}</Text>
                    <Text style={styles.taskWeight}>⚖️ {task.weight} kg</Text>
                    <TouchableOpacity
                      style={styles.startButton}
                      onPress={() => handleCompleteTask(task.id)}
                    >
                      <Ionicons name="play" size={20} color="#fff" />
                      <Text style={styles.startButtonText}>Start Processing</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* In Progress Tasks */}
            {inProgressTasks.length > 0 && (
              <>
                <Text style={styles.taskSectionTitle}>In Progress ({inProgressTasks.length})</Text>
                {inProgressTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskCard}
                    onPress={() => handleViewTask(task)}
                  >
                    <View style={styles.taskHeader}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                        <Text style={styles.statusText}>IN PROGRESS</Text>
                      </View>
                      <Text style={styles.taskPoints}>+{task.points} pts</Text>
                    </View>
                    <Text style={styles.taskType}>
                      ♻️ {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Text>
                    <Text style={styles.taskLocation}>📍 {task.location}</Text>
                    <Text style={styles.taskWeight}>⚖️ {task.weight} kg</Text>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => handleCompleteTask(task.id)}
                    >
                      <Ionicons name="checkmark" size={20} color="#fff" />
                      <Text style={styles.completeButtonText}>Mark Complete</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <>
                <Text style={styles.taskSectionTitle}>Recently Completed ({completedTasks.length})</Text>
                {completedTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskCard}
                    onPress={() => handleViewTask(task)}
                  >
                    <View style={styles.taskHeader}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                        <Text style={styles.statusText}>COMPLETED</Text>
                      </View>
                      <Text style={styles.taskPoints}>+{task.points} pts</Text>
                    </View>
                    <Text style={styles.taskType}>
                      ♻️ {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Text>
                    <Text style={styles.taskLocation}>📍 {task.location}</Text>
                    <Text style={styles.taskWeight}>⚖️ {task.weight} kg</Text>
                    <Text style={styles.completedTime}>
                      ✅ Completed {new Date(task.completedAt).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="reload-circle" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No recycling tasks</Text>
                <Text style={styles.emptyStateSubtext}>
                  New recycling tasks will appear here when available
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

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
    backgroundColor: '#E8F5E9',
    marginRight: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  materialCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  materialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  materialType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  materialWeight: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  materialPoints: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 2,
  },
  tasksList: {
    flex: 1,
  },
  taskSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  taskType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  taskLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  taskWeight: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  completedTime: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
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

export default RecyclerHomeScreen;
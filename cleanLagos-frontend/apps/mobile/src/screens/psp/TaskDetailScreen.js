import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const [showContact, setShowContact] = useState(false);

  const openNavigation = () => {
    const { lat, lng } = task.location.coordinates;
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `google.navigation:q=${lat},${lng}`,
    });
    
    Linking.openURL(url).catch(() => {
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      Linking.openURL(webUrl);
    });
  };

  const callCitizen = () => {
    const phoneNumber = `tel:${task.citizen.phone}`;
    Linking.openURL(phoneNumber);
  };

  const shareLocation = async () => {
    const { lat, lng } = task.location.coordinates;
    const message = `CleanLagos Task Location: ${task.location.address}\nhttps://maps.google.com/?q=${lat},${lng}`;
    
    try {
      await Share.share({
        message,
        title: 'Task Location',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getStatusInfo = () => {
    switch (task.status) {
      case 'assigned':
        return {
          color: '#2196F3',
          icon: 'time',
          text: 'Assigned - Awaiting acceptance',
          action: 'Accept task to begin',
        };
      case 'accepted':
        return {
          color: '#FF9800',
          icon: 'play-circle',
          text: 'In Progress',
          action: 'Navigate to location',
        };
      case 'completed':
        return {
          color: '#4CAF50',
          icon: 'checkmark-circle',
          text: 'Completed',
          action: `Completed on ${new Date(task.completedAt).toLocaleDateString()}`,
        };
      default:
        return {
          color: '#666',
          icon: 'help-circle',
          text: 'Unknown',
          action: '',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareLocation}>
          <Ionicons name="share-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: `${statusInfo.color}15` }]}>
        <Ionicons name={statusInfo.icon} size={24} color={statusInfo.color} />
        <View style={styles.statusContent}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
          <Text style={styles.statusAction}>{statusInfo.action}</Text>
        </View>
      </View>

      {/* Task Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Task Information</Text>
          <View style={[styles.priorityBadge, { backgroundColor: 
            task.priority === 'high' ? '#F44336' :
            task.priority === 'medium' ? '#FF9800' : '#4CAF50'
          }]}>
            <Text style={styles.priorityText}>{task.priority.toUpperCase()} PRIORITY</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.infoText}>{task.location.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color="#666" />
          <Text style={styles.infoText}>
            Estimated time: {task.estimatedTime} minutes
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.infoText}>
            Deadline: {new Date(task.deadline).toLocaleString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="trash" size={20} color="#666" />
          <Text style={styles.infoText}>
            Waste type: {task.wasteType.charAt(0).toUpperCase() + task.wasteType.slice(1)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="trophy" size={20} color="#666" />
          <Text style={styles.infoText}>
            Points value: {task.pointsValue} points
          </Text>
        </View>
      </View>

      {/* Description Card */}
      {task.description && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      )}

      {/* Citizen Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Citizen Information</Text>
        <View style={styles.citizenInfo}>
          <View style={styles.citizenAvatar}>
            <Text style={styles.citizenInitial}>
              {task.citizen.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.citizenDetails}>
            <Text style={styles.citizenName}>{task.citizen.name}</Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => setShowContact(!showContact)}
            >
              <Ionicons name="call" size={16} color="#2196F3" />
              <Text style={styles.contactButtonText}>
                {showContact ? task.citizen.phone : 'Show Contact'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {showContact && (
          <TouchableOpacity style={styles.callButton} onPress={callCitizen}>
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call Citizen</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Map Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Location</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: task.location.coordinates.lat,
            longitude: task.location.coordinates.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={task.location.coordinates}
            title="Task Location"
            description={task.location.address}
          >
            <View style={styles.mapMarker}>
              <Ionicons name="location" size={20} color="#fff" />
            </View>
          </Marker>
        </MapView>
        <TouchableOpacity style={styles.navigateButton} onPress={openNavigation}>
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.navigateButtonText}>Navigate to Location</Text>
        </TouchableOpacity>
      </View>

      {/* Report Images */}
      {task.reportImages && task.reportImages.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Report Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {task.reportImages.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.reportImage}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Completion Proof */}
      {task.completionProof && task.completionProof.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Completion Proof</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {task.completionProof.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.reportImage}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action Buttons */}
      {task.status === 'assigned' && (
        <TouchableOpacity style={styles.acceptButton}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.acceptButtonText}>Accept This Task</Text>
        </TouchableOpacity>
      )}

      {task.status === 'accepted' && (
        <TouchableOpacity style={styles.completeButton}>
          <Ionicons name="checkmark-done" size={24} color="#fff" />
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    gap: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusAction: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  citizenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  citizenAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  citizenInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  citizenDetails: {
    flex: 1,
  },
  citizenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactButtonText: {
    color: '#2196F3',
    fontSize: 14,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    gap: 8,
  },
  callButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginVertical: 15,
  },
  mapMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reportImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    gap: 12,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9C27B0',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    gap: 12,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
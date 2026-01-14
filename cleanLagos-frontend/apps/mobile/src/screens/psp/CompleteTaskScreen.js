import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { completeTask, addNotification } from '../../store';

export default function CompleteTaskScreen({ route, navigation }) {
  const { taskId } = route.params;
  const dispatch = useDispatch();
  
  const [completionData, setCompletionData] = useState({
    notes: '',
    weight: '',
    timeTaken: '',
    images: [],
  });
  
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const cameraRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Request camera permission
  React.useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (hasCameraPermission !== 'granted') {
      Alert.alert('Camera permission required');
      return;
    }

    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });

        const newImage = {
          uri: photo.uri,
          base64: photo.base64,
          id: `proof_${Date.now()}`,
        };

        setCompletionData({
          ...completionData,
          images: [...completionData.images, newImage],
        });

        setIsCameraVisible(false);

        dispatch(
          addNotification({
            type: 'success',
            message: 'Photo captured',
          })
        );
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const newImage = {
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
        id: `proof_${Date.now()}`,
      };

      setCompletionData({
        ...completionData,
        images: [...completionData.images, newImage],
      });
    }
  };

  const removeImage = (id) => {
    setCompletionData({
      ...completionData,
      images: completionData.images.filter((img) => img.id !== id),
    });
  };

  const handleSubmit = async () => {
    if (completionData.images.length === 0) {
      Alert.alert(
        'Proof Required',
        'Please add at least one photo as proof of completion.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(
        completeTask({
          taskId,
          completionData: {
            notes: completionData.notes,
            weight: completionData.weight ? parseFloat(completionData.weight) : null,
            timeTaken: completionData.timeTaken ? parseInt(completionData.timeTaken) : null,
            images: completionData.images.map((img) => img.uri),
          },
        })
      );

      if (completeTask.fulfilled.match(result)) {
        dispatch(
          addNotification({
            type: 'success',
            message: 'Task completed successfully!',
            duration: 5000,
          })
        );
        navigation.goBack();
        navigation.goBack(); // Go back to task list
      }
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCameraModal = () => (
    <View style={styles.cameraModal}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
      >
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cameraCloseButton}
            onPress={() => setIsCameraVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Task</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>
        Add completion details and proof photos
      </Text>

      {/* Proof Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Proof Photos ({completionData.images.length}/3)
        </Text>
        <Text style={styles.sectionSubtitle}>
          Take before/after photos as proof of cleanup
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
          <TouchableOpacity style={styles.addPhotoButton} onPress={() => setIsCameraVisible(true)}>
            <View style={styles.addPhotoContent}>
              <Ionicons name="camera" size={32} color="#9C27B0" />
              <Text style={styles.addPhotoText}>Take Photo</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
            <View style={styles.addPhotoContent}>
              <Ionicons name="images" size={32} color="#9C27B0" />
              <Text style={styles.addPhotoText}>From Gallery</Text>
            </View>
          </TouchableOpacity>

          {completionData.images.map((image) => (
            <View key={image.id} style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(image.id)}
              >
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Completion Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completion Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Weight Collected (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 25.5"
            value={completionData.weight}
            onChangeText={(text) => setCompletionData({ ...completionData, weight: text })}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Time Taken (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 45"
            value={completionData.timeTaken}
            onChangeText={(text) => setCompletionData({ ...completionData, timeTaken: text })}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any additional notes about the cleanup..."
            value={completionData.notes}
            onChangeText={(text) => setCompletionData({ ...completionData, notes: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Requirements */}
      <View style={styles.requirements}>
        <Text style={styles.requirementsTitle}>Requirements:</Text>
        <View style={styles.requirementItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.requirementText}>At least 1 proof photo required</Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.requirementText}>Photos should show before/after state</Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.requirementText}>Complete cleanup of reported area</Text>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting || completionData.images.length === 0}
      >
        <Ionicons name="checkmark-done" size={24} color="#fff" />
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Mark as Complete'}
        </Text>
      </TouchableOpacity>

      {/* Camera Modal */}
      {isCameraVisible && renderCameraModal()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  imagesScroll: {
    flexDirection: 'row',
  },
  addPhotoButton: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#9C27B0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addPhotoContent: {
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#9C27B0',
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 100,
  },
  requirements: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
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
  disabledButton: {
    backgroundColor: '#BA68C8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1000,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 30,
  },
  cameraCloseButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
});
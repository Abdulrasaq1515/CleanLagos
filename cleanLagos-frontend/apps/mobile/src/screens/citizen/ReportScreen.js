import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitReport,
  addOfflineReport,
  addNotification,
  setNetworkStatus,
} from '../../store';
import { uploadImage, validateImage } from '../../services/uploadService';


export default function ReportScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.reports);
  const { networkStatus } = useSelector((state) => state.ui);

  const [formData, setFormData] = useState({
    description: '',
    wasteType: 'general',
    urgency: 'medium',
    location: null,
    address: '',
  });

  const [images, setImages] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');
    })();
  }, []);

  // Get current location
  const getCurrentLocation = async () => {
    if (hasLocationPermission !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'Please enable location services to auto-fill your address.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsGettingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setFormData({
        ...formData,
        location: { lat: latitude, lng: longitude },
        address: `${address.street || ''}, ${address.city || 'Lagos'}, ${address.region || 'Lagos State'
          }`.trim(),
      });

      dispatch(
        addNotification({
          type: 'success',
          message: 'Location captured successfully',
        })
      );
    } catch (error) {
      console.error('Error getting location:', error);
      dispatch(
        addNotification({
          type: 'error',
          message: 'Failed to get location',
        })
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    if (hasCameraPermission !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access to take photos.',
        [{ text: 'OK' }]
      );
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
          id: `img_${Date.now()}`,
        };

        setImages([...images, newImage]);
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

  // Pick photo from gallery
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
        id: `img_${Date.now()}`,
      };

      setImages([...images, newImage]);

      dispatch(
        addNotification({
          type: 'success',
          message: 'Photo selected',
        })
      );
    }
  };

  // Remove image
  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Submit report
  const handleSubmit = async () => {
    if (!formData.address.trim()) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Please provide a location',
        })
      );
      return;
    }

    if (images.length === 0) {
      dispatch(
        addNotification({
          type: 'warning',
          message: 'Add at least one photo for better verification',
        })
      );
      // Continue anyway for now
    }

    setIsUploading(true);
    const uploadedImages = [];
    const failedImages = [];

    try {
      // Validate all images before attempting upload
      for (let i = 0; i < images.length; i++) {
        const validation = await validateImage(images[i].uri);
        if (!validation.ok) {
          dispatch(
            addNotification({
              type: 'error',
              message: `Image ${i + 1}: ${validation.reason}`,
            })
          );
          setIsUploading(false);
          return;
        }
      }

      // Upload images one by one (only if online or for offline queueing)
      if (networkStatus === 'online') {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];

          dispatch(
            addNotification({
              type: 'info',
              message: `Uploading image ${i + 1} of ${images.length}...`,
            })
          );

          try {
            const uploadedImage = await uploadImage(image.uri, (progress) => {
              console.log(`Image ${i + 1} upload progress: ${progress}%`);
            });

            uploadedImages.push(uploadedImage.url);
          } catch (uploadError) {
            // Image upload failed (e.g., not waste, server error, network issue)
            console.error(`Upload failed for image ${i + 1}:`, uploadError.message);

            failedImages.push({
              index: i + 1,
              error: uploadError.message,
              status: uploadError.status,
            });

            // If it's a content validation error (400), show it and ask user to retake
            if (uploadError.status === 400) {
              dispatch(
                addNotification({
                  type: 'error',
                  message: `Image ${i + 1}: ${uploadError.message}`,
                })
              );
            } else {
              // For other errors, keep trying other images
              dispatch(
                addNotification({
                  type: 'warning',
                  message: `Image ${i + 1} failed: ${uploadError.message}`,
                })
              );
            }
          }
        }

        // Check if any images failed
        if (failedImages.length > 0) {
          const contentErrors = failedImages.filter(f => f.status === 400);
          const technicalErrors = failedImages.filter(f => f.status !== 400);

          if (contentErrors.length > 0) {
            // Content validation errors - user needs to retake photos
            dispatch(
              addNotification({
                type: 'error',
                message: `${contentErrors.length} image(s) do not show waste. Please take clear photos of the waste.`,
              })
            );
            setIsUploading(false);
            return;
          }

          if (technicalErrors.length > 0 && uploadedImages.length === 0) {
            // All images failed with technical errors
            dispatch(
              addNotification({
                type: 'error',
                message: 'Could not upload any images. Please try again or check your connection.',
              })
            );
            setIsUploading(false);
            return;
          }

          if (technicalErrors.length > 0) {
            // Some images succeeded, some failed
            dispatch(
              addNotification({
                type: 'warning',
                message: `${technicalErrors.length} image(s) failed to upload. Report submitted with ${uploadedImages.length} image(s).`,
              })
            );
          }
        }
      } else {
        // Offline: store image URIs or base64 for later sync
        uploadedImages.push(...images.map(img => img.uri));
        dispatch(
          addNotification({
            type: 'warning',
            message: 'Offline: Images will be uploaded when connected',
          })
        );
      }

      const reportData = {
        location: {
          address: formData.address,
          coordinates: formData.location,
        },
        description: formData.description,
        wasteType: formData.wasteType,
        urgency: formData.urgency,
        images: uploadedImages,
      };

      // Submit report
      const result = await dispatch(submitReport(reportData));

      if (submitReport.fulfilled.match(result)) {
        dispatch(
          addNotification({
            type: 'success',
            message: 'Report submitted successfully!',
          })
        );
        // Reset form
        setImages([]);
        setFormData({
          description: '',
          wasteType: 'general',
          urgency: 'medium',
          location: null,
          address: '',
        });
        navigation.goBack();
      } else {
        // If report submission failed while offline, queue it
        if (networkStatus === 'offline') {
          dispatch(addOfflineReport(reportData));
          dispatch(
            addNotification({
              type: 'info',
              message: 'Report saved offline and will sync when connected',
            })
          );
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Submit error:', error);

      // If offline, queue the report anyway
      if (networkStatus === 'offline') {
        const reportData = {
          location: {
            address: formData.address,
            coordinates: formData.location,
          },
          description: formData.description,
          wasteType: formData.wasteType,
          urgency: formData.urgency,
          images: uploadedImages,
        };
        dispatch(addOfflineReport(reportData));
        dispatch(
          addNotification({
            type: 'info',
            message: 'Report saved offline and will sync when connected',
          })
        );
        navigation.goBack();
      } else {
        dispatch(
          addNotification({
            type: 'error',
            message: error.message || 'Failed to submit report',
          })
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Waste type options
  const wasteTypes = [
    { id: 'general', label: 'General Waste', icon: 'trash' },
    { id: 'plastic', label: 'Plastic', icon: 'water' },
    { id: 'organic', label: 'Organic', icon: 'leaf' },
    { id: 'hazardous', label: 'Hazardous', icon: 'warning' },
    { id: 'electronic', label: 'E-Waste', icon: 'hardware-chip' },
    { id: 'construction', label: 'Construction', icon: 'construct' },
  ];

  // Urgency options
  const urgencyLevels = [
    { id: 'low', label: 'Low', color: '#4CAF50' },
    { id: 'medium', label: 'Medium', color: '#FF9800' },
    { id: 'high', label: 'High', color: '#F44336' },
  ];

  // Camera modal
  const renderCameraModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isCameraVisible}
      onRequestClose={() => setIsCameraVisible(false)}
    >
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
          ratio="16:9"
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setIsCameraVisible(false)}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePhoto}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() =>
                setCameraType(
                  cameraType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                )
              }
            >
              <Ionicons name="camera-reverse" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Report Waste</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Photos ({images.length}/5)
          </Text>
          <Text style={styles.sectionSubtitle}>
            Clear photos help PSP workers locate the waste
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
            {/* Add Photo Button */}
            <TouchableOpacity style={styles.addPhotoButton} onPress={() => setIsCameraVisible(true)}>
              <View style={styles.addPhotoContent}>
                <Ionicons name="camera" size={32} color="#2E7D32" />
                <Text style={styles.addPhotoText}>Take Photo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
              <View style={styles.addPhotoContent}>
                <Ionicons name="images" size={32} color="#2E7D32" />
                <Text style={styles.addPhotoText}>From Gallery</Text>
              </View>
            </TouchableOpacity>

            {/* Display Selected Photos */}
            {images.map((image) => (
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

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <ActivityIndicator color="#2E7D32" />
            ) : (
              <>
                <Ionicons name="locate" size={20} color="#2E7D32" />
                <Text style={styles.locationButtonText}>Use Current Location</Text>
              </>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Enter address or landmark"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            multiline
            numberOfLines={2}
          />

          {formData.location && (
            <View style={styles.locationInfo}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.locationInfoText}>
                Location captured: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
              </Text>
            </View>
          )}
        </View>

        {/* Waste Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Waste Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wasteTypeScroll}>
            {wasteTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.wasteTypeButton,
                  formData.wasteType === type.id && styles.wasteTypeButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, wasteType: type.id })}
              >
                <Ionicons
                  name={type.icon}
                  size={24}
                  color={formData.wasteType === type.id ? '#fff' : '#2E7D32'}
                />
                <Text
                  style={[
                    styles.wasteTypeText,
                    formData.wasteType === type.id && styles.wasteTypeTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Urgency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Urgency Level</Text>
          <View style={styles.urgencyContainer}>
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.urgencyButton,
                  formData.urgency === level.id && {
                    backgroundColor: level.color,
                    borderColor: level.color,
                  },
                ]}
                onPress={() => setFormData({ ...formData, urgency: level.id })}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    formData.urgency === level.id && styles.urgencyTextSelected,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder="Additional details about the waste..."
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (isLoading || isUploading) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading || isUploading}
        >
          {isLoading || isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>

        {networkStatus === 'offline' && (
          <View style={styles.offlineWarning}>
            <Ionicons name="cloud-offline" size={16} color="#FF9800" />
            <Text style={styles.offlineText}> You're offline. Report will sync when connected.</Text>
          </View>
        )}
      </ScrollView>

      {/* Camera Modal */}
      {renderCameraModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
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
    borderColor: '#2E7D32',
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
    color: '#2E7D32',
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
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    gap: 8,
  },
  locationButtonText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  descriptionInput: {
    minHeight: 100,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  locationInfoText: {
    fontSize: 12,
    color: '#666',
  },
  wasteTypeScroll: {
    flexDirection: 'row',
  },
  wasteTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    gap: 8,
  },
  wasteTypeButtonSelected: {
    backgroundColor: '#2E7D32',
  },
  wasteTypeText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 14,
  },
  wasteTypeTextSelected: {
    color: '#fff',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  urgencyText: {
    fontWeight: '600',
    fontSize: 14,
  },
  urgencyTextSelected: {
    color: '#fff',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#81C784',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  offlineWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 20,
  },
  offlineText: {
    color: '#FF9800',
    fontSize: 12,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 30,
  },
  cameraButton: {
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
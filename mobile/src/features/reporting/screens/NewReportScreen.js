import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Image,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import styles from '../styles/NewReportScreen.styles';

const WASTE_TYPES = [
  { label: '🧴 Plastic', value: 'plastic' },
  { label: '☣️ Chemical', value: 'chemical' },
  { label: '💻 Electronic', value: 'electronic' },
  { label: '🗑️ Other', value: 'other' },
];

const NewReportScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wasteType, setWasteType] = useState('plastic');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required!');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });
    } catch (error) {
      Alert.alert('Error', 'Could not get location!');
    } finally {
      setLocationLoading(false);
    }
  };

  const takePhoto = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Camera permission is required!',
        [{ text: 'OK' }]
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not pick photo!');
    }
  };

  const handleSubmit = async () => {
  console.log('Submitting:', { title, description, location, wasteType });
  if (!title || !description) {
    setError('Please fill in title and description!');
    return;
  }
  
    try {
      setLoading(true);
      setError('');
      await api.post('/reports', {
  title,
  description,
  latitude: location ? location.latitude : 3.8480,
  longitude: location ? location.longitude : 11.5021,
  wasteType,
});
      Alert.alert(
        '✅ Success!',
        'Your waste report has been submitted!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader
        title="New Report"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Plastic waste near market"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the waste problem..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Waste Type</Text>
          <View style={styles.wasteTypeContainer}>
            {WASTE_TYPES.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.wasteTypeButton,
                  wasteType === type.value && styles.wasteTypeSelected
                ]}
                onPress={() => setWasteType(type.value)}
              >
                <Text style={[
                  styles.wasteTypeText,
                  wasteType === type.value && styles.wasteTypeTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Photo</Text>
          {photo ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setPhoto(null)}
              >
                <Text style={styles.removePhotoText}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={takePhoto}
              >
                <Text style={styles.photoButtonIcon}>📷</Text>
                <Text style={styles.photoButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={pickPhoto}
              >
                <Text style={styles.photoButtonIcon}>🖼️</Text>
                <Text style={styles.photoButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Location</Text>
          <TouchableOpacity
            style={[
              styles.locationButton,
              location && styles.locationButtonSuccess
            ]}
            onPress={getLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.locationButtonText}>
                {location ? '✅ Location captured!' : '📍 Get My Location'}
              </Text>
            )}
          </TouchableOpacity>

          {location && (
            <Text style={styles.locationText}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>🗑️ Submit Report</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewReportScreen;
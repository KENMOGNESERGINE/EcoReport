import React, { useState, useRef, useEffect } from 'react';
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
  { label: 'Plastic',    value: 'plastic'    },
  { label: 'Chemical',   value: 'chemical'   },
  { label: 'Electronic', value: 'electronic' },
  { label: 'Other',      value: 'other'      },
];

const notify = (msg, onOk = null) => {
  if (typeof window !== 'undefined') {
    window.alert(msg);
    if (onOk) onOk();
  } else {
    Alert.alert('', msg, [{ text: 'OK', onPress: onOk }]);
  }
};

const NewReportScreen = ({ navigation }) => {
  const [title,           setTitle]           = useState('');
  const [description,     setDescription]     = useState('');
  const [wasteType,       setWasteType]       = useState('plastic');
  const [photo,           setPhoto]           = useState(null);
  const [location,        setLocation]        = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error,           setError]           = useState('');
  const [webCameraActive, setWebCameraActive] = useState(false);
  const [webStream,       setWebStream]       = useState(null);
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  // Attach stream to video element whenever webCameraActive becomes true
  useEffect(() => {
    if (webCameraActive && webStream && videoRef.current) {
      videoRef.current.srcObject = webStream;
      videoRef.current.play().catch(() => {});
    }
  }, [webCameraActive, webStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (webStream) webStream.getTracks().forEach(t => t.stop());
    };
  }, [webStream]);

  const startCamera = async () => {
    if (webCameraActive) {
      // Stop camera
      if (webStream) webStream.getTracks().forEach(t => t.stop());
      setWebStream(null);
      setWebCameraActive(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setWebStream(stream);
      setWebCameraActive(true);
    } catch (err) {
      notify('Could not access camera: ' + err.message);
    }
  };

  const capturePhoto = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) { notify('Camera not ready'); return; }
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhoto(dataUrl);
    if (webStream) webStream.getTracks().forEach(t => t.stop());
    setWebStream(null);
    setWebCameraActive(false);
  };

  const pickFromGallery = async () => {
    if (typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => setPhoto(ev.target.result);
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.7
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const getLocation = async () => {
    setLocationLoading(true);
    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            setLocationLoading(false);
          },
          () => { notify('Could not get location'); setLocationLoading(false); }
        );
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { notify('Location permission required'); setLocationLoading(false); return; }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setLocationLoading(false);
    } catch { notify('Could not get location!'); setLocationLoading(false); }
  };

  const handleSubmit = async () => {
    if (!title || !description) { setError('Please fill in title and description!'); return; }
    try {
      setLoading(true); setError('');
      await api.post('/reports', {
        title, description,
        latitude:  location ? location.latitude  : 3.8480,
        longitude: location ? location.longitude : 11.5021,
        wasteType,
        photoUrl: photo || null,
      });
      notify('Report submitted successfully!', () => navigation.goBack());
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit report');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AppHeader title="New Report" showBack={true} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} placeholder="e.g. Plastic waste near market"
            value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]}
            placeholder="Describe the waste problem..."
            value={description} onChangeText={setDescription}
            multiline numberOfLines={4} />

          <Text style={styles.label}>Waste Type</Text>
          <View style={styles.wasteTypeContainer}>
            {WASTE_TYPES.map(type => (
              <TouchableOpacity key={type.value}
                style={[styles.wasteTypeButton, wasteType === type.value && styles.wasteTypeSelected]}
                onPress={() => setWasteType(type.value)}>
                <Text style={[styles.wasteTypeText, wasteType === type.value && styles.wasteTypeTextSelected]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PHOTO SECTION */}
          <Text style={styles.label}>Photo</Text>

          {/* Always show camera/gallery buttons unless photo taken */}
          {!photo && (
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={[styles.photoButton, webCameraActive && { backgroundColor: '#fde8e8', borderColor: '#d63b3b' }]}
                onPress={startCamera}>
                <Text style={styles.photoButtonIcon}>📷</Text>
                <Text style={styles.photoButtonText}>{webCameraActive ? 'Stop Camera' : 'Camera'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={pickFromGallery}>
                <Text style={styles.photoButtonIcon}>🖼️</Text>
                <Text style={styles.photoButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* LIVE CAMERA PREVIEW — always rendered but hidden when inactive */}
          <View style={{ display: webCameraActive ? 'flex' : 'none', marginTop: 10, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: '#1a7a4a' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', maxHeight: 300, display: 'block', backgroundColor: '#000' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <TouchableOpacity
              onPress={capturePhoto}
              style={{ backgroundColor: '#1a7a4a', padding: 16, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Capture Photo</Text>
            </TouchableOpacity>
          </View>

          {/* CAPTURED PHOTO PREVIEW */}
          {photo && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity style={styles.removePhotoButton} onPress={() => setPhoto(null)}>
                <Text style={styles.removePhotoText}>Remove Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* LOCATION */}
          <Text style={[styles.label, { marginTop: 14 }]}>Location</Text>
          <TouchableOpacity
            style={[styles.locationButton, location && styles.locationButtonSuccess]}
            onPress={getLocation} disabled={locationLoading}>
            {locationLoading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.locationButtonText}>
                  {location ? 'Location captured' : 'Get My Location'}
                </Text>
            }
          </TouchableOpacity>
          {location && (
            <Text style={styles.locationText}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.submitButtonText}>Submit Report</Text>
            }
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewReportScreen;
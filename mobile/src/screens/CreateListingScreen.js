import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Image,
  Platform, KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { Camera } from '../components/CameraWrapper';
import MapView, { Marker } from '../components/MapViewWrapper';
import { useAuth } from '../context/AuthContext';
import { marketplaceService as api } from '../services/api';

const COLORS = {
  green: '#1a7a4a', greenLight: '#e8f5ee', greenDark: '#0d4a28',
  amber: '#e8800a', amberLight: '#fff3e0', white: '#ffffff',
  surface: '#f4f7f5', text: '#1c2620', muted: '#6b7c72', border: '#d0dbd4', red: '#d63b3b',
};

const CATEGORIES = ['Plastic', 'Metal', 'Paper', 'E-Waste', 'Glass', 'Textile', 'Other'];
const CONDITIONS = ['Sorted & Clean', 'Mixed / Unsorted', 'Compressed Bales', 'Raw Collection'];

export default function CreateListingScreen({ navigation }) {
  const { user } = useAuth();

  const [title,       setTitle]       = useState('');
  const [category,    setCategory]    = useState('');
  const [condition,   setCondition]   = useState('Sorted & Clean');
  const [quantity,    setQuantity]    = useState('');
  const [price,       setPrice]       = useState('');
  const [city,        setCity]        = useState('');
  const [description, setDescription] = useState('');
  const [phone,       setPhone]       = useState(user?.phone || '');
  const [images,      setImages]      = useState([]);
  const [recording,   setRecording]   = useState(false);
  const [gpsLoading,  setGpsLoading]  = useState(false);
  const [pickedLat,   setPickedLat]   = useState(null);
  const [pickedLng,   setPickedLng]   = useState(null);
  const [mapRegion,   setMapRegion]   = useState({ latitude: 3.848, longitude: 11.502, latitudeDelta: 0.5, longitudeDelta: 0.5 });
  const [submitting,  setSubmitting]  = useState(false);
  const [toast,       setToast]       = useState({ show: false, msg: '', type: 'success' });

  const showToast = (msg, type = 'success', onDone = null) => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast({ show: false, msg: '', type: 'success' });
      if (onDone) onDone();
    }, 2500);
  };

  // Web camera state
  const [webCameraActive, setWebCameraActive] = useState(false);
  const [webStream,       setWebStream]       = useState(null);
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const recRef     = useRef(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (webStream) webStream.getTracks().forEach(t => t.stop());
    };
  }, [webStream]);

  // ── GUARD ────────────────────────────────────────────
  if (!user?.profileComplete) {
    return (
      <View style={styles.guardContainer}>
        <Text style={styles.guardIcon}>⚠️</Text>
        <Text style={styles.guardTitle}>Complete Your Profile First</Text>
        <Text style={styles.guardText}>
          You need a complete profile with at least one payment account before creating a listing.
        </Text>
        <TouchableOpacity style={styles.guardBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.guardBtnText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── IMAGES ───────────────────────────────────────────
  const pickImages = async () => {
    if (Platform.OS === 'web') {
      // Web file picker
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setImages(prev => [...prev, ev.target.result].slice(0, 8));
          };
          reader.readAsDataURL(file);
        });
      };
      input.click();
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { showToast('❌ Allow photo access in browser settings', 'error'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 8));
  };

  // ── WEB CAMERA ───────────────────────────────────────
  const openWebCamera = async () => {
    if (webCameraActive) {
      // Stop camera
      if (webStream) webStream.getTracks().forEach(t => t.stop());
      setWebStream(null);
      setWebCameraActive(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setWebStream(stream);
      setWebCameraActive(true);
      // Attach stream to video element after render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 200);
    } catch (err) {
      showToast('❌ Camera error: ' + err.message, 'error');
    }
  };

  const captureWebPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setImages(prev => [...prev, dataUrl].slice(0, 8));
    showToast('📸 Photo captured and added!', 'success');
  };

  const openCamera = async () => {
    if (Platform.OS === 'web') { openWebCamera(); return; }
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') { showToast('❌ Allow camera access in browser settings', 'error'); return; }
  };

  const removeImage = i => setImages(prev => prev.filter((_, idx) => idx !== i));

  // ── MIC ──────────────────────────────────────────────
  const toggleMic = async () => {
    if (recording) {
      await recRef.current?.stopAndUnloadAsync();
      recRef.current = null;
      setRecording(false);
      showToast('🎙 Audio note recorded!', 'success');
      return;
    }
    if (Platform.OS === 'web') {
      showToast('🎙 Voice notes work on the mobile app', 'success');
      return;
    }
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') { showToast('❌ Allow microphone access in browser settings', 'error'); return; }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const { recording: rec } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    recRef.current = rec;
    setRecording(true);
  };

  // ── GPS ──────────────────────────────────────────────
  const getGPS = async () => {
    setGpsLoading(true);
    try {
      if (Platform.OS === 'web') {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setPickedLat(lat); setPickedLng(lng);
            setMapRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.02, longitudeDelta: 0.02 });
            setCity(prev => prev || 'Current Location');
            setGpsLoading(false);
          },
          (err) => { showToast('❌ GPS: ' + err.message, 'error'); setGpsLoading(false); },
          { enableHighAccuracy: true }
        );
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Location permission denied');
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;
      setPickedLat(lat); setPickedLng(lng);
      setMapRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.02, longitudeDelta: 0.02 });
      const [geo] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (geo?.city) setCity(geo.city);
    } catch (err) {
      showToast('❌ GPS: ' + (err.message || 'Could not get location'), 'error');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleMapPress = e => {
    if (Platform.OS === 'web') return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPickedLat(latitude); setPickedLng(longitude);
  };

  // ── SUBMIT ───────────────────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim())    { showToast('❌ Enter a listing title', 'error'); return; }
    if (!category)        { showToast('❌ Select a category', 'error'); return; }
    if (!quantity.trim()) { showToast('❌ Enter quantity', 'error'); return; }
    if (!price.trim())    { showToast('❌ Enter a price', 'error'); return; }
    if (!city.trim())     { showToast('❌ Enter city/location', 'error'); return; }

    setSubmitting(true);
    try {
      const data = { title, category, condition, quantity, price, city, description, phone };
      if (pickedLat) { data.latitude = pickedLat; data.longitude = pickedLng; }
      const result = await api.createListing(data, images);
      console.log('Listing created:', result);

      // Reset form
      setTitle(''); setCategory(''); setQuantity(''); setPrice('');
      setCity(''); setDescription(''); setImages([]);
      setPickedLat(null); setPickedLng(null);
      if (webStream) { webStream.getTracks().forEach(t => t.stop()); setWebStream(null); setWebCameraActive(false); }

      // Show success toast then navigate
      showToast('✅ Listing created! Taking you to marketplace…', 'success', () => {
        navigation.navigate('Main', { screen: 'Browse' });
      });

    } catch (err) {
      if (err.error === 'PROFILE_INCOMPLETE') {
        showToast('⚠️ Complete your profile and add a payment account first!', 'error', () => {
          navigation.navigate('Profile');
        });
      } else {
        console.error('Create listing error:', JSON.stringify(err));
        showToast('❌ ' + (err.error || err.message || 'Could not create listing'), 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('Main', { screen: 'Browse' })}>
              <Text style={styles.backBtnText}>← Home</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Post a Listing</Text>
          <Text style={styles.headerSub}>List your recyclable materials for buyers to find</Text>
        </View>

        {/* PHOTOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {images.map((uri, i) => (
                <View key={i} style={styles.photoThumb}>
                  <Image source={{ uri }} style={styles.photoImage} />
                  <TouchableOpacity style={styles.photoRemove} onPress={() => removeImage(i)}>
                    <Text style={styles.photoRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 8 && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImages}>
                    <Text style={styles.addPhotoBtnIcon}>🖼</Text>
                    <Text style={styles.addPhotoBtnText}>Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.addPhotoBtn, webCameraActive && { backgroundColor: '#fde8e8', borderColor: COLORS.red }]}
                    onPress={openCamera}>
                    <Text style={styles.addPhotoBtnIcon}>{webCameraActive ? '⏹' : '📷'}</Text>
                    <Text style={styles.addPhotoBtnText}>{webCameraActive ? 'Stop' : 'Camera'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          {/* WEB CAMERA LIVE VIEW */}
          {webCameraActive && Platform.OS === 'web' && (
            <View style={styles.webCameraContainer}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', borderRadius: 10, backgroundColor: '#000', maxHeight: 300 }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <TouchableOpacity style={styles.captureBtn} onPress={captureWebPhoto}>
                <Text style={styles.captureBtnText}>📸 Capture Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SENSORS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sensors</Text>
          <View style={styles.sensorRow}>
            <TouchableOpacity
              style={[styles.sensorBtn, !!pickedLat && styles.sensorBtnActive]}
              onPress={getGPS}
              disabled={gpsLoading}>
              {gpsLoading
                ? <ActivityIndicator size="small" color={COLORS.green} />
                : <Text style={styles.sensorIcon}>📍</Text>
              }
              <Text style={[styles.sensorLabel, !!pickedLat && styles.sensorLabelActive]}>
                {gpsLoading ? 'Getting GPS…' : 'GPS Location'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sensorBtn, recording && styles.sensorBtnActive]}
              onPress={toggleMic}>
              <Text style={styles.sensorIcon}>{recording ? '⏹' : '🎙'}</Text>
              <Text style={[styles.sensorLabel, recording && styles.sensorLabelActive]}>
                {recording ? 'Stop Recording' : 'Voice Note'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sensorBtn, webCameraActive && styles.sensorBtnActive]}
              onPress={openCamera}>
              <Text style={styles.sensorIcon}>{webCameraActive ? '⏹' : '📷'}</Text>
              <Text style={[styles.sensorLabel, webCameraActive && styles.sensorLabelActive]}>
                {webCameraActive ? 'Stop Camera' : 'Camera'}
              </Text>
            </TouchableOpacity>
          </View>
          {pickedLat && (
            <Text style={styles.gpsConfirm}>✅ Location pinned: {pickedLat.toFixed(4)}, {pickedLng.toFixed(4)}</Text>
          )}
          {webCameraActive && (
            <View style={[styles.webCameraContainer, { marginTop: 14 }]}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', borderRadius: 10, backgroundColor: '#000', maxHeight: 300 }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <TouchableOpacity style={styles.captureBtn} onPress={captureWebPhoto}>
                <Text style={styles.captureBtnText}>📸 Capture Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* FORM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Details</Text>
          <Field label="Title *" value={title} onChangeText={setTitle} placeholder="e.g. Mixed Plastic Bales — 500kg" />

          <Text style={styles.fieldLabel}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
                  <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.fieldLabel}>Condition</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {CONDITIONS.map(c => (
                <TouchableOpacity key={c} style={[styles.chip, condition === c && styles.chipActive]} onPress={() => setCondition(c)}>
                  <Text style={[styles.chipText, condition === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Field label="Quantity *" value={quantity} onChangeText={setQuantity} placeholder="e.g. 500 kg" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Price (XAF) *" value={price} onChangeText={setPrice} placeholder="15000" keyboardType="numeric" />
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Field label="City *" value={city} onChangeText={setCity} placeholder="Yaoundé" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Contact Phone" value={phone} onChangeText={setPhone} placeholder="+237 6XX" keyboardType="phone-pad" />
            </View>
          </View>
          <Field label="Description" value={description} onChangeText={setDescription}
            placeholder="Describe material, origin, purity…" multiline numberOfLines={4} style={{ minHeight: 90 }} />
        </View>

        {/* MAP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pin Pickup Location</Text>
          <Text style={styles.mapHint}>
            {Platform.OS === 'web' ? 'Use GPS button above to set location' : 'Tap the map to pin your pickup location'}
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              region={mapRegion}
              onPress={handleMapPress}>
              {pickedLat && <Marker coordinate={{ latitude: pickedLat, longitude: pickedLng }} />}
            </MapView>
          </View>
        </View>

        {/* SUBMIT */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>✅ Create Listing</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, style, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={[styles.input, props.multiline && { textAlignVertical: 'top' }, style]}
        placeholderTextColor={COLORS.muted} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  guardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: COLORS.white },
  guardIcon: { fontSize: 56, marginBottom: 16 },
  guardTitle: { fontSize: 22, fontWeight: '800', color: COLORS.red, marginBottom: 8, textAlign: 'center' },
  guardText: { fontSize: 15, color: COLORS.muted, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  guardBtn: { backgroundColor: COLORS.green, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 },
  guardBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  header: { backgroundColor: COLORS.greenDark, paddingTop: 54, paddingBottom: 20, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  backBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  headerTitle: { color: COLORS.white, fontSize: 26, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 },
  section: { backgroundColor: COLORS.white, marginBottom: 10, paddingHorizontal: 16, paddingVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  addPhotoBtn: { width: 90, height: 90, backgroundColor: COLORS.greenLight, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.green, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addPhotoBtnIcon: { fontSize: 22 },
  addPhotoBtnText: { fontSize: 11, color: COLORS.green, fontWeight: '600', marginTop: 4 },
  photoThumb: { width: 90, height: 90, borderRadius: 12, overflow: 'hidden', marginRight: 8, position: 'relative' },
  photoImage: { width: '100%', height: '100%' },
  photoRemove: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  photoRemoveText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  webCameraContainer: { marginTop: 12, borderRadius: 10, overflow: 'hidden', backgroundColor: '#000' },
  captureBtn: { backgroundColor: COLORS.green, padding: 12, alignItems: 'center', marginTop: 8, borderRadius: 10 },
  captureBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  sensorRow: { flexDirection: 'row', gap: 10 },
  sensorBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: COLORS.border },
  sensorBtnActive: { backgroundColor: COLORS.greenLight, borderColor: COLORS.green },
  sensorIcon: { fontSize: 20 },
  sensorLabel: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  sensorLabelActive: { color: COLORS.green },
  gpsConfirm: { marginTop: 8, fontSize: 12, color: COLORS.green, fontWeight: '600' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.surface },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
  chipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  chipTextActive: { color: COLORS.white },
  mapHint: { fontSize: 12, color: COLORS.muted, marginBottom: 10 },
  mapContainer: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  map: { height: 220 },
  submitBtn: { backgroundColor: COLORS.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  submitBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 17 },
  toast:        { position: 'absolute', bottom: 30, left: 20, right: 20, padding: 16, borderRadius: 14, alignItems: 'center', zIndex: 9999, elevation: 10 },
  toastSuccess: { backgroundColor: '#1a7a4a' },
  toastError:   { backgroundColor: '#d63b3b' },
  toastText:    { color: '#fff', fontWeight: '700', fontSize: 15, textAlign: 'center' },
});
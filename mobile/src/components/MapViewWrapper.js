// Cross-platform MapView wrapper
// On web: uses OpenStreetMap iframe
// On native: uses react-native-maps
import React from 'react';
import { Platform, View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

let NativeMapView = null;
let NativeMarker  = null;

if (Platform.OS !== 'web') {
  try {
    const Maps   = require('react-native-maps');
    NativeMapView = Maps.default;
    NativeMarker  = Maps.Marker;
  } catch (e) {
    console.warn('react-native-maps not available');
  }
}

// Web map using OpenStreetMap
const WebMapView = ({ style, initialRegion }) => {
  const lat = initialRegion?.latitude  || 3.848;
  const lng = initialRegion?.longitude || 11.502;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <View style={[styles.container, style]}>
      <iframe src={src} style={{ width: '100%', height: '100%', border: 'none' }} title="map" />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`)}>
        <Text style={styles.btnText}>Open in Google Maps →</Text>
      </TouchableOpacity>
    </View>
  );
};

const WebMarker = () => null;

export const Marker         = Platform.OS === 'web' ? WebMarker  : (NativeMarker  || WebMarker);
export const PROVIDER_GOOGLE = Platform.OS === 'web' ? null       : 'google';

const styles = StyleSheet.create({
  container: { overflow: 'hidden', borderRadius: 8, position: 'relative', backgroundColor: '#e8f5ee' },
  btn:       { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#1a7a4a', padding: 8, borderRadius: 8 },
  btnText:   { color: '#fff', fontSize: 12, fontWeight: '600' },
});

export default Platform.OS === 'web' ? WebMapView : (NativeMapView || WebMapView);
// WEB version - camera not supported
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Camera = ({ style, children }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.text}>📷 Camera not available on web{'\n'}Use the mobile app to take photos</Text>
    {children}
  </View>
);

Camera.Constants = { Type: { back: 'back', front: 'front' } };
Camera.requestCameraPermissionsAsync = async () => ({ status: 'denied' });

const styles = StyleSheet.create({
  container: { backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  text: { color: '#fff', textAlign: 'center', fontSize: 14, lineHeight: 24, padding: 20 },
});

export default Camera;
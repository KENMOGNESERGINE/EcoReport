import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './styles/LoadingScreen.styles';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2E7D32" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default LoadingScreen;
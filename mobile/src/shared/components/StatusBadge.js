import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles/StatusBadge.styles';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#FF8F00';
    case 'in_progress': return '#1976D2';
    case 'resolved': return '#388E3C';
    default: return '#FF8F00';
  }
};

const StatusBadge = ({ status }) => {
  const color = getStatusColor(status);
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>
        {status?.replace('_', ' ')}
      </Text>
    </View>
  );
};

export default StatusBadge;
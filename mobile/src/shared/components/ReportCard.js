import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';
import styles from './styles/ReportCard.styles';

const getWasteIcon = (wasteType) => {
  switch (wasteType) {
    case 'plastic': return '🧴';
    case 'chemical': return '☣️';
    case 'electronic': return '💻';
    default: return '🗑️';
  }
};

const ReportCard = ({ report, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
  <Text style={styles.icon}>
    {getWasteIcon(report.waste_type)}
  </Text>
</View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {report.title}
          </Text>
          <Text style={styles.date}>
            {new Date(report.created_at).toLocaleDateString()}
          </Text>
        </View>
        <StatusBadge status={report.status} />
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {report.description}
      </Text>
    </TouchableOpacity>
  );
};

export default ReportCard;
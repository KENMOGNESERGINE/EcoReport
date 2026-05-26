import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles/StatsBar.styles';

const StatsBar = ({ reports }) => {
  const total = reports.length;
  const pending = reports.filter(r => r.status === 'pending').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{total}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, styles.pendingNumber]}>
          {pending}
        </Text>
        <Text style={styles.statLabel}>Pending</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, styles.resolvedNumber]}>
          {resolved}
        </Text>
        <Text style={styles.statLabel}>Resolved</Text>
      </View>
    </View>
  );
};

export default StatsBar;
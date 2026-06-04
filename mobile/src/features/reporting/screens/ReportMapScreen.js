import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import ReportCard from '../../../shared/components/ReportCard';
import styles from '../styles/ReportMapScreen.styles';

const ReportMapScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="🗺️ Waste Map"
        subtitle={`${reports.length} reports in Cameroon`}
      />
      <View style={styles.mapComingSoon}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapTitle}>Map View</Text>
        <Text style={styles.mapSubtitle}>
          Coming soon in full build!
        </Text>
      </View>
      <FlatList
        data={reports}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => navigation.navigate('Reports', {
              screen: 'ReportDetail',
              params: { report: item }
            })}
          />
        )}
      />
    </View>
  );
};

export default ReportMapScreen;
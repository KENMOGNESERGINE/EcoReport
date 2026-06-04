import React, { useState, useEffect } from 'react';
import {
  View, FlatList, RefreshControl
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import ReportCard from '../../../shared/components/ReportCard';
import StatsBar from '../../../shared/components/StatsBar';
import EmptyState from '../../../shared/components/EmptyState';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import styles from '../styles/MyReportsScreen.styles';

const MyReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const response = await api.get('/reports/mine');
      setReports(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading your reports..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Reports 📋"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={reports}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<StatsBar reports={reports} />}
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => navigation.navigate('ReportDetail', { report: item })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchMyReports(); }}
            colors={['#2E7D32']}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="No reports yet!"
            subtitle="Start reporting waste in your area!"
            buttonText="+ Submit First Report"
            onButtonPress={() => navigation.navigate('NewReport')}
          />
        }
      />
    </View>
  );
};

export default MyReportsScreen;
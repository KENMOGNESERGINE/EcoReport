import React, { useState, useEffect } from 'react';
import {
  View, FlatList, TouchableOpacity,
  Text, RefreshControl
} from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import ReportCard from '../../../shared/components/ReportCard';
import StatsBar from '../../../shared/components/StatsBar';
import EmptyState from '../../../shared/components/EmptyState';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import styles from '../styles/ReportListScreen.styles';

const ReportListScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

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
      setRefreshing(false);
    }
  };

  const getTopReporter = () => {
    if (reports.length === 0) return null;
    return user?.name || 'Anonymous';
  };

  const getMonthlyCount = () => {
    const thisMonth = new Date().getMonth();
    return reports.filter(r =>
      new Date(r.created_at).getMonth() === thisMonth
    ).length;
  };

  const CommunityImpact = () => (
    <View style={styles.impactContainer}>
      <Text style={styles.impactTitle}>🌱 Community Impact</Text>
      <Text style={styles.impactText}>
        Together we reported{' '}
        <Text style={styles.impactHighlight}>
          {getMonthlyCount()} waste spots
        </Text>
        {' '}this month!
      </Text>
      <View style={styles.impactRow}>
        <View style={styles.impactStat}>
          <Text style={styles.impactStatIcon}>🥇</Text>
          <Text style={styles.impactStatText}>
            Top reporter: {getTopReporter()}
          </Text>
        </View>
        <View style={styles.impactStat}>
          <Text style={styles.impactStatIcon}>✅</Text>
          <Text style={styles.impactStatText}>
            {reports.filter(r => r.status === 'resolved').length} resolved
          </Text>
        </View>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View>
      <StatsBar reports={reports} />
      <CommunityImpact />
      <Text style={styles.sectionTitle}>📍 Recent Reports</Text>
    </View>
  );

  if (loading) return <LoadingScreen message="Loading reports..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="EcoReport 🌍"
        subtitle={`Welcome, ${user?.name}!`}
        rightComponent={
          <TouchableOpacity
            style={styles.newReportButton}
            onPress={() => navigation.navigate('NewReport')}
          >
            <Text style={styles.newReportButtonText}>+ Report</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={reports}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => navigation.navigate('ReportDetail', { report: item })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchReports(); }}
            colors={['#2E7D32']}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🗑️"
            title="No reports yet!"
            subtitle="Be the first to report waste in your area"
            buttonText="+ Submit Report"
            onButtonPress={() => navigation.navigate('NewReport')}
          />
        }
      />
    </View>
  );
};

export default ReportListScreen;
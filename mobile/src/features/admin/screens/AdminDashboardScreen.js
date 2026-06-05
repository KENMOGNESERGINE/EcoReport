import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import styles from '../styles/AdminDashboardScreen.styles';

const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading dashboard..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="👨‍💻 Admin"
        subtitle={`Welcome, ${user?.name}`}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchStats(); }}
            colors={['#B71C1C']}
          />
        }
      >

        {/* System Stats */}
        <Text style={styles.sectionTitle}>📊 System Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statRed]}>
            <Text style={styles.statNumber}>
              {stats?.users?.total_users || 0}
            </Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={[styles.statCard, styles.statBlue]}>
            <Text style={styles.statNumber}>
              {stats?.reports?.total_reports || 0}
            </Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={[styles.statCard, styles.statGreen]}>
            <Text style={styles.statNumber}>
              {stats?.campaigns?.total_campaigns || 0}
            </Text>
            <Text style={styles.statLabel}>Campaigns</Text>
          </View>
          <View style={[styles.statCard, styles.statOrange]}>
            <Text style={styles.statNumber}>
              {stats?.reports?.resolved || 0}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* User Breakdown */}
        <Text style={styles.sectionTitle}>👥 User Breakdown</Text>
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownIcon}>👤</Text>
            <Text style={styles.breakdownLabel}>Citizens</Text>
            <Text style={styles.breakdownCount}>
              {stats?.users?.citizens || 0}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownIcon}>🤝</Text>
            <Text style={styles.breakdownLabel}>Associations</Text>
            <Text style={styles.breakdownCount}>
              {stats?.users?.associations || 0}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownIcon}>🏛️</Text>
            <Text style={styles.breakdownLabel}>Government</Text>
            <Text style={styles.breakdownCount}>
              {stats?.users?.government || 0}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownIcon}>🧹</Text>
            <Text style={styles.breakdownLabel}>Agents</Text>
            <Text style={styles.breakdownCount}>
              {stats?.users?.agents || 0}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionLabel}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionLabel}>All Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionLabel}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Report Stats */}
        <Text style={styles.sectionTitle}>📋 Report Status</Text>
        <View style={styles.reportStatsCard}>
          <View style={styles.reportStatRow}>
            <Text style={styles.reportStatLabel}>🟡 Pending</Text>
            <Text style={styles.reportStatValue}>
              {stats?.reports?.pending || 0}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.reportStatRow}>
            <Text style={styles.reportStatLabel}>🔵 Resolved</Text>
            <Text style={styles.reportStatValue}>
              {stats?.reports?.resolved || 0}
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default AdminDashboardScreen;
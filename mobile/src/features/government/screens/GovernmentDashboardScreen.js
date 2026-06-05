import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import styles from '../styles/GovernmentDashboardScreen.styles';

const GovernmentDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, hotspotsRes] = await Promise.all([
        api.get('/government/stats'),
        api.get('/government/hotspots'),
      ]);
      setStats(statsRes.data.data);
      setHotspots(hotspotsRes.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="🏛️ Government"
        subtitle={`Welcome, ${user?.name}`}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Stats Cards */}
        <Text style={styles.sectionTitle}>📊 Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statBlue]}>
            <Text style={styles.statNumber}>
              {stats?.total_reports || 0}
            </Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={[styles.statCard, styles.statOrange]}>
            <Text style={styles.statNumber}>
              {stats?.pending || 0}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, styles.statPurple]}>
            <Text style={styles.statNumber}>
              {stats?.in_progress || 0}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={[styles.statCard, styles.statGreen]}>
            <Text style={styles.statNumber}>
              {stats?.resolved || 0}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Citizens */}
        <View style={styles.citizensCard}>
          <Text style={styles.citizensIcon}>👥</Text>
          <View>
            <Text style={styles.citizensNumber}>
              {stats?.total_citizens || 0}
            </Text>
            <Text style={styles.citizensLabel}>
              Active Citizens
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('GovReportsTab')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionLabel}>View Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('GovStats')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>Statistics</Text>
          </TouchableOpacity>
        </View>

        {/* Hotspots */}
        {hotspots.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🔥 Waste Hotspots</Text>
            {hotspots.slice(0, 3).map((spot, index) => (
              <View key={index} style={styles.hotspotCard}>
                <Text style={styles.hotspotRank}>#{index + 1}</Text>
                <View style={styles.hotspotInfo}>
                  <Text style={styles.hotspotType}>
                    {spot.waste_type} waste
                  </Text>
                  <Text style={styles.hotspotCount}>
                    {spot.count} reports
                  </Text>
                </View>
                <Text style={styles.hotspotIcon}>🔥</Text>
              </View>
            ))}
          </>
        )}

      </ScrollView>
    </View>
  );
};

export default GovernmentDashboardScreen;
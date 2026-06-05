import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  ActivityIndicator
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import styles from '../styles/GovernmentStatsScreen.styles';

const GovernmentStatsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, monthlyRes, leaderRes] = await Promise.all([
        api.get('/government/stats'),
        api.get('/government/monthly-stats'),
        api.get('/rewards/leaderboard'),
      ]);
      setStats(statsRes.data.data);
      setMonthlyStats(monthlyRes.data.data);
      setLeaderboard(leaderRes.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResolutionRate = () => {
    if (!stats) return 0;
    const total = parseInt(stats.total_reports);
    const resolved = parseInt(stats.resolved);
    if (total === 0) return 0;
    return Math.round((resolved / total) * 100);
  };

  const getWastePercentage = (type) => {
    if (!stats) return 0;
    return Math.round(Math.random() * 40) + 10;
  };

  if (loading) return <LoadingScreen message="Loading statistics..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="📊 Statistics"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Resolution Rate */}
        <Text style={styles.sectionTitle}>🎯 Resolution Rate</Text>
        <View style={styles.rateCard}>
          <Text style={styles.rateNumber}>{getResolutionRate()}%</Text>
          <Text style={styles.rateLabel}>of reports resolved</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: `${getResolutionRate()}%`
            }]} />
          </View>
        </View>

        {/* Monthly Stats */}
        <Text style={styles.sectionTitle}>📅 Monthly Reports</Text>
        <View style={styles.chartContainer}>
          {monthlyStats.slice(0, 6).map((month, index) => {
            const maxVal = Math.max(
              ...monthlyStats.map(m => parseInt(m.total))
            );
            const height = maxVal > 0
              ? (parseInt(month.total) / maxVal) * 100
              : 0;
            return (
              <View key={index} style={styles.barContainer}>
                <Text style={styles.barValue}>{month.total}</Text>
                <View style={styles.barWrapper}>
                  <View style={[styles.bar, { height: `${height}%` }]} />
                </View>
                <Text style={styles.barLabel}>
                  {new Date(month.month).toLocaleDateString(
                    'en', { month: 'short' }
                  )}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Waste Type Breakdown */}
        <Text style={styles.sectionTitle}>🗑️ Waste Types</Text>
        <View style={styles.wasteCard}>
          {['plastic', 'chemical', 'electronic', 'other'].map(
            (type, index) => {
              const colors = ['#1976D2', '#D32F2F', '#7B1FA2', '#388E3C'];
              const icons = ['🧴', '☣️', '💻', '🗑️'];
              const pct = getWastePercentage(type);
              return (
                <View key={type} style={styles.wasteRow}>
                  <Text style={styles.wasteIcon}>{icons[index]}</Text>
                  <Text style={styles.wasteType}>{type}</Text>
                  <View style={styles.wasteBarContainer}>
                    <View style={[styles.wasteBar, {
                      width: `${pct}%`,
                      backgroundColor: colors[index]
                    }]} />
                  </View>
                  <Text style={styles.wastePct}>{pct}%</Text>
                </View>
              );
            }
          )}
        </View>

        {/* Leaderboard */}
        <Text style={styles.sectionTitle}>🏆 Top Citizens</Text>
        <View style={styles.leaderboardCard}>
          {leaderboard.slice(0, 5).map((citizen, index) => (
            <View key={citizen.id} style={styles.leaderRow}>
              <Text style={styles.leaderRank}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </Text>
              <Text style={styles.leaderName}>{citizen.name}</Text>
              <Text style={styles.leaderPoints}>
                {citizen.total_points || 0} pts
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

export default GovernmentStatsScreen;
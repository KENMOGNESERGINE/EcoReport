import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import styles from '../styles/AssociationDashboardScreen.styles';

const AssociationDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, campaignsRes, reportsRes] = await Promise.all([
        api.get('/association/stats'),
        api.get('/association/campaigns'),
        api.get('/association/reports'),
      ]);
      setStats(statsRes.data.data);
      setCampaigns(campaignsRes.data.data.slice(0, 3));
      setReports(reportsRes.data.data.slice(0, 5));
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
        title="🤝 Association"
        subtitle={`Welcome, ${user?.name}`}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            colors={['#2E7D32']}
          />
        }
      >

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statGreen]}>
            <Text style={styles.statNumber}>
              {stats?.totalCampaigns || 0}
            </Text>
            <Text style={styles.statLabel}>Campaigns</Text>
          </View>
          <View style={[styles.statCard, styles.statBlue]}>
            <Text style={styles.statNumber}>
              {stats?.totalParticipants || 0}
            </Text>
            <Text style={styles.statLabel}>Participants</Text>
          </View>
          <View style={[styles.statCard, styles.statOrange]}>
            <Text style={styles.statNumber}>
              {stats?.totalResolved || 0}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AssocCampaigns', {
              screen: 'CreateCampaign'
            })}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionLabel}>New Campaign</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AssocReportsTab')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionLabel}>View Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AssocCampaigns')}
          >
            <Text style={styles.actionIcon}>📢</Text>
            <Text style={styles.actionLabel}>Campaigns</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Campaigns */}
        <Text style={styles.sectionTitle}>📢 Upcoming Campaigns</Text>
        {campaigns.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No campaigns yet!</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('AssocCampaigns', {
                screen: 'CreateCampaign'
              })}
            >
              <Text style={styles.createButtonText}>
                + Create First Campaign
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          campaigns.map(campaign => (
            <View key={campaign.id} style={styles.campaignCard}>
              <View style={styles.campaignHeader}>
                <Text style={styles.campaignTitle}>
                  {campaign.title}
                </Text>
                <Text style={styles.campaignDate}>
                  📅 {new Date(campaign.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.campaignLocation}>
                📍 {campaign.location}
              </Text>
              <Text style={styles.campaignParticipants}>
                👥 {campaign.participants_count || 0}/
                {campaign.max_participants} participants
              </Text>
            </View>
          ))
        )}

        {/* Recent Reports */}
        <Text style={styles.sectionTitle}>📋 Recent Reports</Text>
        {reports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No reports in your area!</Text>
          </View>
        ) : (
          reports.map(report => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportRow}>
                <Text style={styles.reportTitle} numberOfLines={1}>
                  {report.title}
                </Text>
                <View style={[styles.statusDot, {
                  backgroundColor:
                    report.status === 'pending' ? '#FF8F00' :
                    report.status === 'in_progress' ? '#1976D2' :
                    '#388E3C'
                }]} />
              </View>
              <Text style={styles.reportDate}>
                {new Date(report.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}

      </ScrollView>
    </View>
  );
};

export default AssociationDashboardScreen;
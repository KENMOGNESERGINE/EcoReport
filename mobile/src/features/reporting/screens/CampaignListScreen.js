import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, RefreshControl, Alert
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import EmptyState from '../../../shared/components/EmptyState';
import styles from '../styles/CampaignListScreen.styles';

const CampaignListScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joining, setJoining] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns');
      setCampaigns(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleJoin = async (campaign) => {
    try {
      setJoining(campaign.id);
      await api.post(`/campaigns/${campaign.id}/join`);
      Alert.alert(
        '✅ Joined!',
        `You joined "${campaign.title}"!`
      );
      fetchCampaigns();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to join!'
      );
    } finally {
      setJoining(null);
    }
  };

  const getProgressPercentage = (current, max) => {
    if (!max || max === 0) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const renderCampaign = ({ item }) => (
    <TouchableOpacity
      style={styles.campaignCard}
      onPress={() => navigation.navigate(
        'CampaignDetail', { campaign: item }
      )}
    >
      {/* Header */}
      <View style={styles.campaignHeader}>
        <View style={styles.campaignIconContainer}>
          <Text style={styles.campaignIcon}>📢</Text>
        </View>
        <View style={styles.campaignInfo}>
          <Text style={styles.campaignTitle}>{item.title}</Text>
          <Text style={styles.campaignOrg}>
            🤝 {item.association_name}
          </Text>
        </View>
        <View style={[styles.statusBadge, {
          backgroundColor:
            item.status === 'upcoming' ? '#FF8F00' + '20' :
            '#388E3C' + '20'
        }]}>
          <Text style={[styles.statusText, {
            color: item.status === 'upcoming' ? '#FF8F00' : '#388E3C'
          }]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* Date and Location */}
      <View style={styles.detailsRow}>
        <Text style={styles.detailItem}>
          📅 {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.detailItem}>
          📍 {item.location}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>👥 Participants</Text>
          <Text style={styles.progressCount}>
            {item.participants_count || 0}/{item.max_participants}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${getProgressPercentage(
              item.participants_count || 0,
              item.max_participants
            )}%`
          }]} />
        </View>
      </View>

      {/* Join Button */}
      <TouchableOpacity
        style={[
          styles.joinButton,
          joining === item.id && styles.joinButtonDisabled
        ]}
        onPress={() => handleJoin(item)}
        disabled={joining === item.id}
      >
        <Text style={styles.joinButtonText}>
          {joining === item.id ? '⏳ Joining...' : '🙋 Join Campaign'}
        </Text>
      </TouchableOpacity>

    </TouchableOpacity>
  );

  if (loading) return <LoadingScreen message="Loading campaigns..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="📢 Campaigns"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={campaigns}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderCampaign}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchCampaigns(); }}
            colors={['#2E7D32']}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📢"
            title="No campaigns yet!"
            subtitle="Check back later for upcoming cleanup campaigns!"
          />
        }
      />
    </View>
  );
};

export default CampaignListScreen;
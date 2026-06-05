import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import styles from '../styles/CampaignDetailScreen.styles';

const CampaignDetailScreen = ({ navigation, route }) => {
  const { campaign: initialCampaign } = route.params;
  const [campaign, setCampaign] = useState(initialCampaign);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/campaigns/${initialCampaign.id}`
      );
      setCampaign(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setJoining(true);
      await api.post(`/campaigns/${campaign.id}/join`);
      setJoined(true);
      Alert.alert(
        '🎉 Joined!',
        `You joined "${campaign.title}"! See you there!`
      );
      fetchCampaign();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to join!'
      );
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    Alert.alert(
      'Leave Campaign',
      'Are you sure you want to leave?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setLeaving(true);
              await api.delete(`/campaigns/${campaign.id}/leave`);
              setJoined(false);
              Alert.alert('✅', 'You left the campaign!');
              fetchCampaign();
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLeaving(false);
            }
          }
        }
      ]
    );
  };

  const getProgressPercentage = () => {
    const current = campaign.participants_count || 0;
    const max = campaign.max_participants;
    if (!max || max === 0) return 0;
    return Math.min((current / max) * 100, 100);
  };

  if (loading) return <LoadingScreen message="Loading campaign..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="Campaign Detail"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>📢</Text>
          <Text style={styles.bannerStatus}>
            {campaign.status}
          </Text>
        </View>

        <View style={styles.content}>

          {/* Title */}
          <Text style={styles.title}>{campaign.title}</Text>

          {/* Organization */}
          <Text style={styles.organization}>
            🤝 Organized by {campaign.association_name}
          </Text>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {new Date(campaign.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {campaign.location}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>👥</Text>
              <Text style={styles.detailLabel}>Participants</Text>
              <Text style={styles.detailValue}>
                {campaign.participants_count || 0}/
                {campaign.max_participants}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {
                width: `${getProgressPercentage()}%`
              }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(getProgressPercentage())}% full
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionLabel}>
              📝 About this Campaign
            </Text>
            <Text style={styles.description}>
              {campaign.description}
            </Text>
          </View>

          {/* Rewards Info */}
          <View style={styles.rewardsCard}>
            <Text style={styles.rewardsTitle}>
              🏆 Earn Rewards!
            </Text>
            <Text style={styles.rewardsText}>
              Join this campaign and earn double points
              for every waste report during the event!
            </Text>
          </View>

          {/* Join/Leave Button */}
          {joined ? (
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeave}
              disabled={leaving}
            >
              {leaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.leaveButtonText}>
                  ✅ Joined — Leave Campaign
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.joinButton,
                joining && styles.joinButtonDisabled
              ]}
              onPress={handleJoin}
              disabled={joining}
            >
              {joining ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.joinButtonText}>
                  🙋 Join Campaign
                </Text>
              )}
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

export default CampaignDetailScreen;
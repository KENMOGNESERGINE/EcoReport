import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, RefreshControl
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import EmptyState from '../../../shared/components/EmptyState';
import styles from '../styles/AssociationCampaignsScreen.styles';

const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Completed'];

const AssociationCampaignsScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/association/campaigns');
      setCampaigns(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getFilteredCampaigns = () => {
    if (activeFilter === 'All') return campaigns;
    return campaigns.filter(c =>
      c.status === activeFilter.toLowerCase()
    );
  };

  const getProgressPercentage = (current, max) => {
    if (!max || max === 0) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const renderCampaign = ({ item }) => (
    <View style={styles.campaignCard}>

      {/* Header */}
      <View style={styles.campaignHeader}>
        <Text style={styles.campaignIcon}>📢</Text>
        <View style={styles.campaignInfo}>
          <Text style={styles.campaignTitle}>{item.title}</Text>
          <Text style={styles.campaignDate}>
            📅 {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, {
          backgroundColor:
            item.status === 'upcoming' ? '#FF8F00' + '20' :
            item.status === 'ongoing' ? '#1976D2' + '20' :
            '#388E3C' + '20'
        }]}>
          <Text style={[styles.statusText, {
            color:
              item.status === 'upcoming' ? '#FF8F00' :
              item.status === 'ongoing' ? '#1976D2' :
              '#388E3C'
          }]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* Location */}
      <Text style={styles.campaignLocation}>
        📍 {item.location}
      </Text>

      {/* Participants Progress */}
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

    </View>
  );

  if (loading) return <LoadingScreen message="Loading campaigns..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="📢 Campaigns"
        rightComponent={
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateCampaign')}
          >
            <Text style={styles.createButtonText}>+ New</Text>
          </TouchableOpacity>
        }
      />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.filterTabActive
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.filterTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFilteredCampaigns()}
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
            subtitle="Create your first cleanup campaign!"
            buttonText="+ Create Campaign"
            onButtonPress={() => navigation.navigate('CreateCampaign')}
          />
        }
      />
    </View>
  );
};

export default AssociationCampaignsScreen;
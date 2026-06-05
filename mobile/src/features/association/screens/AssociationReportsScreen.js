import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, RefreshControl,
  Modal, Alert
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import StatusBadge from '../../../shared/components/StatusBadge';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import EmptyState from '../../../shared/components/EmptyState';
import styles from '../styles/AssociationReportsScreen.styles';

const FILTERS = ['All', 'Pending', 'In Progress'];
const STATUS_OPTIONS = [
  { label: '🔄 Mark In Progress', value: 'in_progress' },
  { label: '✅ Mark Resolved', value: 'resolved' },
];

const getWasteIcon = (wasteType) => {
  switch (wasteType) {
    case 'plastic': return '🧴';
    case 'chemical': return '☣️';
    case 'electronic': return '💻';
    default: return '🗑️';
  }
};

const AssociationReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/association/reports');
      setReports(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getFilteredReports = () => {
    if (activeFilter === 'All') return reports;
    return reports.filter(r =>
      r.status === activeFilter.toLowerCase().replace(' ', '_')
    );
  };

  const handleUpdateStatus = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const confirmUpdate = async (status) => {
    try {
      setUpdating(true);
      await api.patch(
        `/association/reports/${selectedReport.id}/status`,
        { status }
      );
      setModalVisible(false);
      Alert.alert('✅ Success', 'Status updated successfully!');
      fetchReports();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportIcon}>
          {getWasteIcon(item.waste_type)}
        </Text>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.reportReporter}>
            👤 {item.reporter_name || 'Anonymous'}
          </Text>
          <Text style={styles.reportDate}>
            📅 {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <Text style={styles.reportDescription} numberOfLines={2}>
        {item.description}
      </Text>

      {item.status !== 'resolved' && (
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => handleUpdateStatus(item)}
        >
          <Text style={styles.updateButtonText}>
            🔄 Update Status
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) return <LoadingScreen message="Loading reports..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="📋 Area Reports"
        showBack={true}
        onBack={() => navigation.goBack()}
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
        data={getFilteredReports()}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderReport}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchReports(); }}
            colors={['#2E7D32']}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="No reports found!"
            subtitle="No reports match this filter"
          />
        }
      />

      {/* Status Update Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              🔄 Update Status
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedReport?.title}
            </Text>

            {STATUS_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.statusOption}
                onPress={() => confirmUpdate(option.value)}
                disabled={updating}
              >
                <Text style={styles.statusOptionText}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default AssociationReportsScreen;
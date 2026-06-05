import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, Modal, TextInput,
  RefreshControl
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import StatusBadge from '../../../shared/components/StatusBadge';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import EmptyState from '../../../shared/components/EmptyState';
import styles from '../styles/GovernmentReportsScreen.styles';

const FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];

const getWasteIcon = (wasteType) => {
  switch (wasteType) {
    case 'plastic': return '🧴';
    case 'chemical': return '☣️';
    case 'electronic': return '💻';
    default: return '🗑️';
  }
};

const GovernmentReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [notes, setNotes] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, agentsRes] = await Promise.all([
        api.get('/government/reports'),
        api.get('/government/agents'),
      ]);
      setReports(reportsRes.data.data);
      setAgents(agentsRes.data.data);
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

  const handleAssign = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const confirmAssign = async () => {
    if (!selectedAgent) return;
    try {
      setAssigning(true);
      await api.post(
        `/government/reports/${selectedReport.id}/assign`,
        { agentId: selectedAgent.id, notes }
      );
      setModalVisible(false);
      setSelectedAgent(null);
      setNotes('');
      fetchData();
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setAssigning(false);
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
        </View>
        <StatusBadge status={item.status} />
      </View>
      <Text style={styles.reportDescription} numberOfLines={2}>
        {item.description}
      </Text>
      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() => handleAssign(item)}
        >
          <Text style={styles.assignButtonText}>
            🧹 Assign to Agent
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) return <LoadingScreen message="Loading reports..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="📋 All Reports"
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
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            colors={['#1565C0']}
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

      {/* Assign Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              🧹 Assign to Agent
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedReport?.title}
            </Text>

            <Text style={styles.modalLabel}>Select Agent:</Text>
            {agents.length === 0 ? (
              <Text style={styles.noAgents}>
                No agents available!
              </Text>
            ) : (
              agents.map(agent => (
                <TouchableOpacity
                  key={agent.id}
                  style={[
                    styles.agentItem,
                    selectedAgent?.id === agent.id &&
                    styles.agentItemSelected
                  ]}
                  onPress={() => setSelectedAgent(agent)}
                >
                  <Text style={styles.agentName}>
                    🧹 {agent.name}
                  </Text>
                  <Text style={styles.agentReports}>
                    {agent.assigned_reports} active
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <Text style={styles.modalLabel}>Notes:</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add instructions for the agent..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !selectedAgent && styles.confirmButtonDisabled
                ]}
                onPress={confirmAssign}
                disabled={!selectedAgent || assigning}
              >
                {assigning ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Assign ✅
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default GovernmentReportsScreen;
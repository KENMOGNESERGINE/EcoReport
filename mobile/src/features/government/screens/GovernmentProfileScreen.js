import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, TextInput,
  Modal, Alert, RefreshControl
} from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import styles from '../styles/GovernmentProfileScreen.styles';

const GovernmentProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    department: '',
    jurisdiction: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/government/profile');
      setProfile(response.data.data);
      if (response.data.data) {
        setEditData({
          department: response.data.data.department || '',
          jurisdiction: response.data.data.jurisdiction || '',
          phone: response.data.data.phone || '',
        });
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await api.put('/government/profile', editData);
      setEditModalVisible(false);
      Alert.alert('✅ Success', 'Profile updated!');
      fetchProfile();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  if (loading) return <LoadingScreen message="Loading profile..." />;

  return (
    <View style={styles.container}>
      <AppHeader title="🏛️ Government Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchProfile(); }}
            colors={['#1565C0']}
          />
        }
      >

        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>🏛️</Text>
          </View>
          <Text style={styles.govName}>{user?.name}</Text>
          <Text style={styles.govEmail}>{user?.email}</Text>
          {profile?.department && (
            <Text style={styles.govDepartment}>
              🏢 {profile.department}
            </Text>
          )}
          {profile?.jurisdiction && (
            <Text style={styles.govJurisdiction}>
              📍 {profile.jurisdiction}
            </Text>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Performance Stats */}
        <Text style={styles.sectionTitle}>📊 Performance</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statBlue]}>
            <Text style={styles.statNumber}>
              {profile?.stats?.total_assignments || 0}
            </Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
          <View style={[styles.statCard, styles.statGreen]}>
            <Text style={styles.statNumber}>
              {profile?.stats?.resolved_reports || 0}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={[styles.statCard, styles.statOrange]}>
            <Text style={styles.statNumber}>
              {profile?.stats?.total_agents || 0}
            </Text>
            <Text style={styles.statLabel}>Agents</Text>
          </View>
          <View style={[styles.statCard, styles.statPurple]}>
            <Text style={styles.statNumber}>
              {profile?.avgResolutionDays || 0}
            </Text>
            <Text style={styles.statLabel}>Avg Days</Text>
          </View>
        </View>

        {/* Info Card */}
        <Text style={styles.sectionTitle}>ℹ️ Official Info</Text>
        <View style={styles.infoCard}>
          {profile?.department && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🏢</Text>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{profile.department}</Text>
            </View>
          )}
          {profile?.jurisdiction && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoLabel}>Jurisdiction</Text>
                <Text style={styles.infoValue}>{profile.jurisdiction}</Text>
              </View>
            </>
          )}
          {profile?.phone && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📞</Text>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>
            </>
          )}
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

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Edit Profile</Text>

            <Text style={styles.modalLabel}>Department</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Ministry of Environment"
              value={editData.department}
              onChangeText={(text) => setEditData({
                ...editData, department: text
              })}
            />

            <Text style={styles.modalLabel}>Jurisdiction</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Yaoundé City"
              value={editData.jurisdiction}
              onChangeText={(text) => setEditData({
                ...editData, jurisdiction: text
              })}
            />

            <Text style={styles.modalLabel}>Phone</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="+237 6XX XXX XXX"
              value={editData.phone}
              onChangeText={(text) => setEditData({
                ...editData, phone: text
              })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : 'Save ✅'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default GovernmentProfileScreen;
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
import styles from '../styles/AssociationProfileScreen.styles';

const AssociationProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [achievementModalVisible, setAchievementModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    foundedYear: '',
    zone: '',
    membersCount: '',
    mission: '',
    wasteCollected: '',
    phone: '',
    website: '',
  });

  const [achievementData, setAchievementData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/association/profile');
      setProfile(response.data.data);
      if (response.data.data) {
        setEditData({
          foundedYear: response.data.data.founded_year?.toString() || '',
          zone: response.data.data.zone || '',
          membersCount: response.data.data.members_count?.toString() || '',
          mission: response.data.data.mission || '',
          wasteCollected: response.data.data.waste_collected?.toString() || '',
          phone: response.data.data.phone || '',
          website: response.data.data.website || '',
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
      await api.put('/association/profile', editData);
      setEditModalVisible(false);
      Alert.alert('✅ Success', 'Profile updated!');
      fetchProfile();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAchievement = async () => {
    if (!achievementData.title) {
      Alert.alert('Error', 'Please enter a title!');
      return;
    }
    try {
      setSaving(true);
      await api.post('/association/profile/achievements', achievementData);
      setAchievementModalVisible(false);
      setAchievementData({ title: '', description: '' });
      Alert.alert('✅ Success', 'Achievement added!');
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
      <AppHeader title="🤝 Association Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchProfile(); }}
            colors={['#2E7D32']}
          />
        }
      >

        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>🤝</Text>
          </View>
          <Text style={styles.associationName}>{user?.name}</Text>
          <Text style={styles.associationEmail}>{user?.email}</Text>
          {profile?.zone && (
            <Text style={styles.associationZone}>
              📍 {profile.zone}
            </Text>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Mission */}
        {profile?.mission && (
          <View style={styles.missionCard}>
            <Text style={styles.sectionTitle}>🎯 Our Mission</Text>
            <Text style={styles.missionText}>{profile.mission}</Text>
          </View>
        )}

        {/* Stats */}
        <Text style={styles.sectionTitle}>📊 Our Impact</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statGreen]}>
            <Text style={styles.statNumber}>
              {profile?.stats?.total_campaigns || 0}
            </Text>
            <Text style={styles.statLabel}>Campaigns</Text>
          </View>
          <View style={[styles.statCard, styles.statBlue]}>
            <Text style={styles.statNumber}>
              {profile?.stats?.total_participants || 0}
            </Text>
            <Text style={styles.statLabel}>Participants</Text>
          </View>
          <View style={[styles.statCard, styles.statOrange]}>
            <Text style={styles.statNumber}>
              {profile?.stats?.total_resolved || 0}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={[styles.statCard, styles.statPurple]}>
            <Text style={styles.statNumber}>
              {profile?.waste_collected || 0}
            </Text>
            <Text style={styles.statLabel}>Tons Collected</Text>
          </View>
        </View>

        {/* Info Card */}
        <Text style={styles.sectionTitle}>ℹ️ About Us</Text>
        <View style={styles.infoCard}>
          {profile?.founded_year && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoLabel}>Founded</Text>
              <Text style={styles.infoValue}>{profile.founded_year}</Text>
            </View>
          )}
          {profile?.members_count > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>👥</Text>
                <Text style={styles.infoLabel}>Members</Text>
                <Text style={styles.infoValue}>{profile.members_count}</Text>
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
          {profile?.website && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🌐</Text>
                <Text style={styles.infoLabel}>Website</Text>
                <Text style={styles.infoValue}>{profile.website}</Text>
              </View>
            </>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsHeader}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAchievementModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {profile?.achievements?.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No achievements yet! Add your first one!
            </Text>
          </View>
        ) : (
          profile?.achievements?.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>
                  {achievement.title}
                </Text>
                {achievement.description && (
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                )}
                <Text style={styles.achievementDate}>
                  {new Date(achievement.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}

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
            <ScrollView>
              {[
                { label: 'Founded Year', key: 'foundedYear', placeholder: '2010' },
                { label: 'Zone/Area', key: 'zone', placeholder: 'Yaoundé Centre' },
                { label: 'Members Count', key: 'membersCount', placeholder: '50' },
                { label: 'Phone', key: 'phone', placeholder: '+237 6XX XXX XXX' },
                { label: 'Website', key: 'website', placeholder: 'www.example.cm' },
                { label: 'Waste Collected (tons)', key: 'wasteCollected', placeholder: '2.5' },
              ].map(field => (
                <View key={field.key}>
                  <Text style={styles.modalLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder={field.placeholder}
                    value={editData[field.key]}
                    onChangeText={(text) => setEditData({
                      ...editData, [field.key]: text
                    })}
                  />
                </View>
              ))}
              <Text style={styles.modalLabel}>Mission</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Our mission is..."
                value={editData.mission}
                onChangeText={(text) => setEditData({
                  ...editData, mission: text
                })}
                multiline
                numberOfLines={4}
              />
            </ScrollView>
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

      {/* Add Achievement Modal */}
      <Modal
        visible={achievementModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🏆 Add Achievement</Text>
            <Text style={styles.modalLabel}>Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 100 Reports Resolved!"
              value={achievementData.title}
              onChangeText={(text) => setAchievementData({
                ...achievementData, title: text
              })}
            />
            <Text style={styles.modalLabel}>Description (optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder="Tell us more..."
              value={achievementData.description}
              onChangeText={(text) => setAchievementData({
                ...achievementData, description: text
              })}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAchievementModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddAchievement}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Adding...' : 'Add ✅'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default AssociationProfileScreen;
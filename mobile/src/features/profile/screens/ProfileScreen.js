import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, Alert
} from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import styles from '../styles/ProfileScreen.styles';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'citizen') {
      fetchPoints();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await api.get('/rewards/my-points');
      setPoints(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'citizen': return '👤';
      case 'association': return '🤝';
      case 'government': return '🏛️';
      case 'admin': return '👨‍💻';
      case 'agent': return '🧹';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'citizen': return '#2E7D32';
      case 'association': return '#1565C0';
      case 'government': return '#6A1B9A';
      case 'admin': return '#B71C1C';
      case 'agent': return '#E65100';
      default: return '#2E7D32';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, {
            borderColor: getRoleColor(user?.role)
          }]}>
            <Text style={styles.avatarIcon}>
              {getRoleIcon(user?.role)}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={[styles.roleBadge, {
            backgroundColor: getRoleColor(user?.role) + '20'
          }]}>
            <Text style={[styles.roleText, {
              color: getRoleColor(user?.role)
            }]}>
              {user?.role}
            </Text>
          </View>
        </View>

        {/* Points Section — Citizen only */}
        {user?.role === 'citizen' && points && (
          <TouchableOpacity
            style={styles.pointsCard}
            onPress={() => navigation.navigate('Reports', {
              screen: 'Rewards'
            })}
          >
            <View style={styles.pointsLeft}>
              <Text style={styles.pointsNumber}>
                {points.totalPoints || 0}
              </Text>
              <Text style={styles.pointsLabel}>Points</Text>
            </View>
            <View style={styles.pointsCenter}>
              <Text style={styles.pointsBadge}>{points.badge}</Text>
              <Text style={styles.pointsSubLabel}>Current Badge</Text>
            </View>
            <Text style={styles.pointsArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Menu Section */}
        <View style={styles.menuSection}>

          {/* Citizen Menu */}
          {user?.role === 'citizen' && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Reports', {
                  screen: 'MyReports'
                })}
              >
                <Text style={styles.menuIcon}>📋</Text>
                <Text style={styles.menuLabel}>My Reports</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Reports', {
                  screen: 'CampaignList'
                })}
              >
                <Text style={styles.menuIcon}>📢</Text>
                <Text style={styles.menuLabel}>Campaigns</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Reports', {
                  screen: 'Rewards'
                })}
              >
                <Text style={styles.menuIcon}>🏆</Text>
                <Text style={styles.menuLabel}>My Rewards</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}

          {/* Association Menu */}
          {user?.role === 'association' && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('AssocCampaigns')}
              >
                <Text style={styles.menuIcon}>📢</Text>
                <Text style={styles.menuLabel}>My Campaigns</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('AssocReportsTab')}
              >
                <Text style={styles.menuIcon}>📋</Text>
                <Text style={styles.menuLabel}>Area Reports</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}

          {/* Government Menu */}
          {user?.role === 'government' && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('GovReportsTab')}
              >
                <Text style={styles.menuIcon}>📋</Text>
                <Text style={styles.menuLabel}>All Reports</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('GovStats')}
              >
                <Text style={styles.menuIcon}>📊</Text>
                <Text style={styles.menuLabel}>Statistics</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}

          {/* Admin Menu */}
          {user?.role === 'admin' && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('AdminUsers')}
              >
                <Text style={styles.menuIcon}>👥</Text>
                <Text style={styles.menuLabel}>Manage Users</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}

          {/* Common Menu Items */}
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuLabel}>Notifications</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuLabel}>Settings</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>EcoReport v1.0.0</Text>

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
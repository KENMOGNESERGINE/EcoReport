import React from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, Alert
} from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
import AppHeader from '../../../shared/components/AppHeader';
import styles from '../styles/ProfileScreen.styles';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

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
      case 'association': return '🏢';
      case 'government': return '🏛️';
      default: return '👤';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>
              {getRoleIcon(user?.role)}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Reports', { screen: 'MyReports' })}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuLabel}>My Reports</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

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

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>EcoReport v1.0.0</Text>

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
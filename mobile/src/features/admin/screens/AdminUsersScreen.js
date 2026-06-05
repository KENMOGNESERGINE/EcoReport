import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, RefreshControl,
  Modal, Alert, TextInput
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import EmptyState from '../../../shared/components/EmptyState';
import styles from '../styles/AdminUsersScreen.styles';

const FILTERS = ['All', 'Citizen', 'Association', 'Government', 'Agent'];
const ROLES = ['citizen', 'association', 'government', 'agent', 'admin'];

const getRoleColor = (role) => {
  switch (role) {
    case 'citizen': return '#2E7D32';
    case 'association': return '#1565C0';
    case 'government': return '#6A1B9A';
    case 'agent': return '#E65100';
    case 'admin': return '#B71C1C';
    default: return '#2E7D32';
  }
};

const getRoleIcon = (role) => {
  switch (role) {
    case 'citizen': return '👤';
    case 'association': return '🤝';
    case 'government': return '🏛️';
    case 'agent': return '🧹';
    case 'admin': return '👨‍💻';
    default: return '👤';
  }
};

const AdminUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getFilteredUsers = () => {
    let filtered = users;
    if (activeFilter !== 'All') {
      filtered = filtered.filter(u =>
        u.role === activeFilter.toLowerCase()
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const confirmChangeRole = async (newRole) => {
    try {
      await api.patch(`/admin/users/${selectedUser.id}/role`, {
        role: newRole
      });
      setModalVisible(false);
      Alert.alert('✅ Success', 'Role updated successfully!');
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      '⚠️ Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/users/${user.id}`);
              Alert.alert('✅ Success', 'User deleted!');
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={[styles.userAvatar, {
          backgroundColor: getRoleColor(item.role) + '20'
        }]}>
          <Text style={styles.userAvatarIcon}>
            {getRoleIcon(item.role)}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userDate}>
            Joined: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.roleBadge, {
          backgroundColor: getRoleColor(item.role) + '20'
        }]}>
          <Text style={[styles.roleText, {
            color: getRoleColor(item.role)
          }]}>
            {item.role}
          </Text>
        </View>
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity
          style={styles.changeRoleButton}
          onPress={() => handleChangeRole(item)}
        >
          <Text style={styles.changeRoleText}>🔄 Change Role</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteUser(item)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <LoadingScreen message="Loading users..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        title="👥 Manage Users"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

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
        data={getFilteredUsers()}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderUser}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchUsers(); }}
            colors={['#B71C1C']}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="👥"
            title="No users found!"
            subtitle="No users match your search"
          />
        }
      />

      {/* Change Role Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔄 Change Role</Text>
            <Text style={styles.modalSubtitle}>
              {selectedUser?.name}
            </Text>
            {ROLES.map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.roleOption, {
                  borderColor: getRoleColor(role),
                  backgroundColor: getRoleColor(role) + '10',
                }]}
                onPress={() => confirmChangeRole(role)}
              >
                <Text style={styles.roleOptionIcon}>
                  {getRoleIcon(role)}
                </Text>
                <Text style={[styles.roleOptionText, {
                  color: getRoleColor(role)
                }]}>
                  {role}
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

export default AdminUsersScreen;
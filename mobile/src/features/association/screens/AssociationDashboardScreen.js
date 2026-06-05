import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../shared/context/AuthContext';

const BASE = 'http://localhost:3000';
const GREEN = '#1a7a4a';

const apiCall = async (method, endpoint, body = null) => {
  const token = await AsyncStorage.getItem('ecotrade_token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  const res  = await fetch(`${BASE}${endpoint}`, { method, headers, body: body ? JSON.stringify(body) : null });
  return res.json();
};

export default function AssociationDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await apiCall('GET', '/api/reports/stats');
      setStats(data.data || data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <View style={s.center}><ActivityIndicator color={GREEN} size="large" /></View>;

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Association Dashboard</Text>
        <Text style={s.sub}>Welcome, {user?.name || 'Association'}</Text>
      </View>

      <View style={s.statsGrid}>
        <View style={s.statCard}>
          <Text style={s.statNum}>{stats?.total || 0}</Text>
          <Text style={s.statLabel}>Total Reports</Text>
        </View>
        <View style={s.statCard}>
          <Text style={[s.statNum, { color: '#e8800a' }]}>{stats?.pending || 0}</Text>
          <Text style={s.statLabel}>Pending</Text>
        </View>
        <View style={s.statCard}>
          <Text style={[s.statNum, { color: '#1565c0' }]}>{stats?.in_progress || 0}</Text>
          <Text style={s.statLabel}>In Progress</Text>
        </View>
        <View style={s.statCard}>
          <Text style={[s.statNum, { color: GREEN }]}>{stats?.resolved || 0}</Text>
          <Text style={s.statLabel}>Resolved</Text>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Reports')}>
          <Text style={s.actionIcon}>🗑️</Text>
          <View>
            <Text style={s.actionTitle}>Manage Reports</Text>
            <Text style={s.actionSub}>View and update report statuses</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Campaigns')}>
          <Text style={s.actionIcon}>📣</Text>
          <View>
            <Text style={s.actionTitle}>Manage Campaigns</Text>
            <Text style={s.actionSub}>Create cleanup campaigns for citizens</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: '#0d4a28', padding: 24, paddingTop: 54 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  sub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flex: 1, minWidth: '45%', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  statNum: { fontSize: 32, fontWeight: '800', color: '#1c2620' },
  statLabel: { fontSize: 12, color: '#6b7c72', marginTop: 4 },
  section: { backgroundColor: '#fff', margin: 12, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1c2620', marginBottom: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, backgroundColor: '#f4f7f5', borderRadius: 12, marginBottom: 10 },
  actionIcon: { fontSize: 28 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: '#1c2620' },
  actionSub: { fontSize: 12, color: '#6b7c72', marginTop: 2 },
});
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../shared/context/AuthContext';

const BASE = 'http://93.127.139.4:10051';
const GREEN = '#1a7a4a';

const apiCall = async (method, endpoint) => {
  const token = await AsyncStorage.getItem('ecotrade_token');
  const res = await fetch(`${BASE}${endpoint}`, { headers: { 'Authorization': `Bearer ${token}` } });
  return res.json();
};

export default function GovernmentDashboardScreen({ navigation }) {
  const { user }          = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const data = await apiCall('GET', '/api/reports/stats');
      setStats(data.data || data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <View style={s.center}><ActivityIndicator color={GREEN} size="large" /></View>;

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Government Dashboard</Text>
        <Text style={s.sub}>Communauté Urbaine — {user?.name || 'Official'}</Text>
      </View>

      <View style={s.statsGrid}>
        {[
          { label: 'Total Reports', value: stats?.total || 0, color: '#1c2620' },
          { label: 'Pending',       value: stats?.pending || 0, color: '#e8800a' },
          { label: 'In Progress',   value: stats?.in_progress || 0, color: '#1565c0' },
          { label: 'Resolved',      value: stats?.resolved || 0, color: GREEN },
        ].map(s2 => (
          <View key={s2.label} style={s.statCard}>
            <Text style={[s.statNum, { color: s2.color }]}>{s2.value}</Text>
            <Text style={s.statLabel}>{s2.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Reports')}>
          <Text style={s.actionIcon}>🗑️</Text>
          <View>
            <Text style={s.actionTitle}>All Reports</Text>
            <Text style={s.actionSub}>View and manage all city reports</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Stats')}>
          <Text style={s.actionIcon}>📈</Text>
          <View>
            <Text style={s.actionTitle}>Analytics</Text>
            <Text style={s.actionSub}>City-wide waste statistics</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: '#1a3a6a', padding: 24, paddingTop: 54 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  sub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flex: 1, minWidth: '45%', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  statNum: { fontSize: 32, fontWeight: '800' },
  statLabel: { fontSize: 12, color: '#6b7c72', marginTop: 4 },
  section: { backgroundColor: '#fff', margin: 12, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1c2620', marginBottom: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, backgroundColor: '#f4f7f5', borderRadius: 12, marginBottom: 10 },
  actionIcon: { fontSize: 28 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: '#1c2620' },
  actionSub: { fontSize: 12, color: '#6b7c72', marginTop: 2 },
});
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'http://93.127.139.4:10051';
const GREEN = '#1a7a4a';

const STATUS_COLORS = { pending: '#e8800a', in_progress: '#1565c0', resolved: GREEN };
const NEXT_STATUS = { pending: 'in_progress', in_progress: 'resolved', resolved: 'pending' };
const NEXT_LABEL  = { pending: 'Mark In Progress', in_progress: 'Mark Resolved', resolved: 'Reopen' };

const apiCall = async (method, endpoint, body = null) => {
  const token = await AsyncStorage.getItem('ecotrade_token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${BASE}${endpoint}`, { method, headers, body: body ? JSON.stringify(body) : null });
  return res.json();
};

export default function AssociationReportsScreen({ navigation }) {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await apiCall('GET', '/api/reports');
      setReports(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (report) => {
    const next = NEXT_STATUS[report.status];
    const confirmed = typeof window !== 'undefined'
      ? window.confirm(`Change status to "${next}"?`)
      : true;
    if (!confirmed) return;
    setUpdating(report.id);
    try {
      await apiCall('PATCH', `/api/reports/${report.id}/status`, { status: next });
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: next } : r));
    } catch (e) { alert('Could not update status'); }
    finally { setUpdating(null); }
  };

  if (loading) return <View style={s.center}><ActivityIndicator color={GREEN} size="large" /></View>;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Manage Reports</Text>
        <Text style={s.sub}>{reports.length} total reports</Text>
      </View>
      <FlatList
        data={reports}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
              <View style={[s.badge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
                <Text style={[s.badgeText, { color: STATUS_COLORS[item.status] }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text>
            <Text style={s.cardDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            <View style={s.cardActions}>
              <TouchableOpacity style={s.viewBtn} onPress={() => navigation.navigate('ReportDetail', { report: item })}>
                <Text style={s.viewBtnText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.statusBtn, { backgroundColor: STATUS_COLORS[item.status] }]}
                onPress={() => updateStatus(item)}
                disabled={updating === item.id}>
                {updating === item.id
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={s.statusBtnText}>{NEXT_LABEL[item.status]}</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7c72', marginTop: 40 }}>No reports found</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: '#0d4a28', padding: 24, paddingTop: 54 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  sub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1c2620' },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginLeft: 8 },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  cardDesc: { fontSize: 13, color: '#6b7c72', marginBottom: 6 },
  cardDate: { fontSize: 11, color: '#9e9e9e', marginBottom: 10 },
  cardActions: { flexDirection: 'row', gap: 8 },
  viewBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#1a7a4a', alignItems: 'center' },
  viewBtnText: { color: '#1a7a4a', fontWeight: '600', fontSize: 13 },
  statusBtn: { flex: 2, padding: 10, borderRadius: 8, alignItems: 'center' },
  statusBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
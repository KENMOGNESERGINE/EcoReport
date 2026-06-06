import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'http://93.127.139.4:10051';

export default function GovernmentStatsScreen() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('ecotrade_token');
        const res   = await fetch(`${BASE}/api/reports/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data  = await res.json();
        setStats(data.data || data);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#1a3a6a" size="large" /></View>;

  const resolutionRate = stats?.total ? Math.round(((stats.resolved || 0) / stats.total) * 100) : 0;

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>City Analytics</Text>
        <Text style={s.sub}>Waste management statistics</Text>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>Resolution Rate</Text>
        <View style={s.rateContainer}>
          <Text style={s.rateNum}>{resolutionRate}%</Text>
          <Text style={s.rateSub}>of reports resolved</Text>
        </View>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${resolutionRate}%` }]} />
        </View>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>Report Breakdown</Text>
        {[
          { label: 'Total Reports',  value: stats?.total || 0,       color: '#1c2620' },
          { label: 'Pending',        value: stats?.pending || 0,     color: '#e8800a' },
          { label: 'In Progress',    value: stats?.in_progress || 0, color: '#1565c0' },
          { label: 'Resolved',       value: stats?.resolved || 0,    color: '#1a7a4a' },
        ].map(item => (
          <View key={item.label} style={s.statRow}>
            <Text style={s.statRowLabel}>{item.label}</Text>
            <Text style={[s.statRowValue, { color: item.color }]}>{item.value}</Text>
          </View>
        ))}
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
  section: { backgroundColor: '#fff', margin: 12, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1c2620', marginBottom: 12 },
  rateContainer: { alignItems: 'center', paddingVertical: 16 },
  rateNum: { fontSize: 56, fontWeight: '800', color: '#1a7a4a' },
  rateSub: { fontSize: 14, color: '#6b7c72', marginTop: 4 },
  progressTrack: { height: 12, backgroundColor: '#e0e0e0', borderRadius: 6, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%', backgroundColor: '#1a7a4a', borderRadius: 6 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  statRowLabel: { fontSize: 14, color: '#1c2620' },
  statRowValue: { fontSize: 16, fontWeight: '800' },
});
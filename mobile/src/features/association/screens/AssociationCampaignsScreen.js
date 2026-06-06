import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'http://93.127.139.4:10051';
const GREEN = '#1a7a4a';

const apiCall = async (method, endpoint, body = null) => {
  const token = await AsyncStorage.getItem('ecotrade_token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${BASE}${endpoint}`, { method, headers, body: body ? JSON.stringify(body) : null });
  return res.json();
};

export default function AssociationCampaignsScreen({ navigation }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { loadCampaigns(); }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await apiCall('GET', '/api/campaigns');
      setCampaigns(data.data || data.campaigns || data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <View style={s.center}><ActivityIndicator color={GREEN} size="large" /></View>;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Campaigns</Text>
        <TouchableOpacity style={s.createBtn} onPress={() => navigation.navigate('CreateCampaign', { onCreated: loadCampaigns })}>
          <Text style={s.createBtnText}>+ Create</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={campaigns}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text>
            <View style={s.cardFooter}>
              <Text style={s.cardMeta}>📍 {item.location || item.zone || 'Location TBD'}</Text>
              <Text style={s.cardMeta}>📅 {item.date ? new Date(item.date).toLocaleDateString() : 'TBD'}</Text>
            </View>
            <View style={s.participantBadge}>
              <Text style={s.participantText}>👥 {item.participants_count || 0} participants</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 44 }}>📣</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1c2620', marginTop: 12 }}>No campaigns yet</Text>
            <Text style={{ color: '#6b7c72', marginTop: 4 }}>Create your first cleanup campaign</Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: '#0d4a28', padding: 24, paddingTop: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  createBtn: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  createBtnText: { color: '#0d4a28', fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1c2620', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#6b7c72', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', gap: 14, marginBottom: 8 },
  cardMeta: { fontSize: 12, color: '#6b7c72' },
  participantBadge: { backgroundColor: '#e8f5ee', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  participantText: { color: GREEN, fontSize: 12, fontWeight: '600' },
});
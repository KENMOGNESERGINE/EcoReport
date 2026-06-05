import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE = 'http://localhost:3000';
const GREEN = '#1a7a4a';

const notify = (msg) => {
  if (typeof window !== 'undefined') window.alert(msg);
};

export default function CreateCampaignScreen({ navigation, route }) {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [location,    setLocation]    = useState('');
  const [date,        setDate]        = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const handleCreate = async () => {
    if (!title || !description || !location) { setError('Title, description and location are required'); return; }
    setLoading(true); setError('');
    try {
      const token = await AsyncStorage.getItem('ecotrade_token');
      const res = await fetch(`${BASE}/api/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, description, location, date: date || null }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      notify('Campaign created! Citizens will be notified.');
      if (route?.params?.onCreated) route.params.onCreated();
      navigation.goBack();
    } catch (err) {
      setError(err.message || err.error || 'Could not create campaign');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>Create Campaign</Text>
      </View>
      <View style={s.form}>
        {!!error && <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>}

        <Text style={s.label}>Campaign Title *</Text>
        <TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="e.g. Yaoundé Clean-Up Drive" />

        <Text style={s.label}>Description *</Text>
        <TextInput style={[s.input, { minHeight: 80 }]} value={description} onChangeText={setDescription}
          placeholder="Describe the campaign goal and activities..." multiline numberOfLines={4} />

        <Text style={s.label}>Location *</Text>
        <TextInput style={s.input} value={location} onChangeText={setLocation} placeholder="e.g. Marché Central, Yaoundé" />

        <Text style={s.label}>Date (optional)</Text>
        <TextInput style={s.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

        <View style={s.infoBox}>
          <Text style={s.infoText}>📣 Once created, all registered citizens will receive a notification about this campaign.</Text>
        </View>

        <TouchableOpacity style={s.submitBtn} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitBtnText}>Create Campaign</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f5' },
  header: { backgroundColor: '#0d4a28', padding: 24, paddingTop: 54 },
  back: { marginBottom: 8 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  form: { padding: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#1c2620', marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1.5, borderColor: '#d0dbd4', borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: '#fff', color: '#1c2620' },
  errorBox: { backgroundColor: '#fde8e8', borderRadius: 10, padding: 12, marginBottom: 12 },
  errorText: { color: '#d63b3b', fontSize: 13 },
  infoBox: { backgroundColor: '#e8f5ee', borderRadius: 10, padding: 12, marginTop: 12, marginBottom: 8 },
  infoText: { color: '#1a7a4a', fontSize: 13 },
  submitBtn: { backgroundColor: GREEN, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
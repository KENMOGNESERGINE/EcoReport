import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { marketplaceService as api } from '../services/api';

const COLORS = {
  green: '#1a7a4a', greenLight: '#e8f5ee', greenDark: '#0d4a28',
  white: '#ffffff', surface: '#f4f7f5', text: '#1c2620',
  muted: '#6b7c72', border: '#d0dbd4', red: '#d63b3b',
};

export default function MyListingsScreen() {
  const navigation = useNavigation();
  const [listings,   setListings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.getMyListings();
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const deleteListing = (id, title) => {
    Alert.alert('Delete Listing', `Remove "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await api.deleteListing(id);
        setListings(prev => prev.filter(l => l.id !== id));
      }},
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}>
      <Image
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300' }}
        style={styles.img}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.meta}>{item.city} · {item.quantity}</Text>
        <Text style={styles.price}>{Number(item.price).toLocaleString()} XAF</Text>
        <Text style={styles.date}>{item.created_at?.slice(0, 10)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}>
          <Text style={styles.editBtnText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteListing(item.id, item.title)}>
          <Text style={styles.deleteBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => navigation.navigate('CreateListing')}>
          <Text style={styles.newBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {loading
        ? <ActivityIndicator size="large" color={COLORS.green} style={{ marginTop: 60 }} />
        : <FlatList
            data={listings}
            renderItem={renderItem}
            keyExtractor={i => i.id.toString()}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.green]} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={{ fontSize: 44, marginBottom: 12 }}>📭</Text>
                <Text style={styles.emptyTitle}>No listings yet</Text>
                <Text style={styles.emptySub}>Tap "+ New" to post your first recyclable material</Text>
              </View>
            }
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { backgroundColor: COLORS.greenDark, paddingTop: 54, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: '800' },
  newBtn: { backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  newBtnText: { color: COLORS.green, fontWeight: '700', fontSize: 14 },
  list: { padding: 12 },
  card: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 14, overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  img: { width: 88, height: 88 },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  title: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: 3 },
  meta: { fontSize: 12, color: COLORS.muted, marginBottom: 3 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.green },
  date: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  actions: { paddingRight: 10, alignItems: 'center', justifyContent: 'center', gap: 8 },
  editBtn: { backgroundColor: COLORS.greenLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  editBtnText: { color: COLORS.green, fontWeight: '700', fontSize: 12 },
  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 18 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  emptySub: { fontSize: 14, color: COLORS.muted, textAlign: 'center', paddingHorizontal: 32 },
});

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, Image, RefreshControl, ActivityIndicator,
  StatusBar, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const COLORS = {
  green: '#1a7a4a', greenLight: '#e8f5ee', greenDark: '#0d4a28',
  amber: '#e8800a', white: '#ffffff', surface: '#f4f7f5',
  text: '#1c2620', muted: '#6b7c72', border: '#d0dbd4', red: '#d63b3b',
};

const CATEGORIES = ['All', 'Plastic', 'Metal', 'Paper', 'E-Waste', 'Glass', 'Textile'];

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80';

export default function MarketplaceScreen() {
  const navigation = useNavigation();
  const [listings,     setListings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [page,         setPage]         = useState(1);
  const [loadingMore,  setLoadingMore]  = useState(false);

  const fetchListings = useCallback(async (reset = false) => {
    try {
      const params = {};
      if (activeFilter !== 'All') params.category = activeFilter;
      if (search.trim()) params.search = search.trim();
      params.page  = reset ? 1 : page;
      params.limit = 20;

      const data = await api.getListings(params);
      if (reset) {
        setListings(data.listings);
        setPage(2);
      } else {
        setListings(prev => [...prev, ...data.listings]);
        setPage(p => p + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [activeFilter, search, page]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchListings(true);
  }, [activeFilter, search]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => fetchListings(true));
    return unsub;
  }, [navigation, activeFilter]);

  const onRefresh = () => { setRefreshing(true); fetchListings(true); };
  const onEndReached = () => { if (!loadingMore) { setLoadingMore(true); fetchListings(); } };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}>
      <Image
        source={{ uri: item.image || PLACEHOLDER_IMAGE }}
        style={styles.cardImage}
        defaultSource={{ uri: PLACEHOLDER_IMAGE }}
      />
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryBadgeText}>{item.category}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>📍 {item.city}</Text>
          <Text style={styles.metaText}>📦 {item.quantity}</Text>
        </View>
        <Text style={styles.price}>
          {Number(item.price).toLocaleString()} <Text style={styles.currency}>XAF</Text>
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.sellerRow}>
          <View style={styles.avatarInitial}>
            <Text style={styles.avatarText}>{(item.seller || 'A')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.sellerName} numberOfLines={1}>{item.seller}</Text>
        </View>
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => navigation.navigate('ListingDetail', { listingId: item.id, openBuy: true })}>
          <Text style={styles.buyBtnText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.greenDark} />

      {/* HERO HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>♻ EcoTrade</Text>
        <Text style={styles.headerSub}>Recycling Marketplace</Text>
        {/* SEARCH */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings…"
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: COLORS.muted, fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* FILTERS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, activeFilter === cat && styles.filterChipActive]}
            onPress={() => setActiveFilter(cat)}>
            <Text style={[styles.filterChipText, activeFilter === cat && styles.filterChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTINGS */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.green} />
          <Text style={styles.loadingText}>Loading listings…</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderCard}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.green]} />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>No listings found</Text>
              <Text style={styles.emptySub}>Try adjusting your search or filters</Text>
            </View>
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator color={COLORS.green} style={{ marginVertical: 20 }} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { backgroundColor: COLORS.greenDark, paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { color: COLORS.white, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, height: 44, gap: 8 },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  filtersScroll: { backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border, maxHeight: 52 },
  filtersContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
  filterChipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  filterChipTextActive: { color: COLORS.white },
  listContent: { padding: 10 },
  row: { justifyContent: 'space-between', paddingHorizontal: 4 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, overflow: 'hidden', marginBottom: 12, width: '48%', borderWidth: 1, borderColor: COLORS.border },
  cardImage: { width: '100%', height: 130, backgroundColor: COLORS.greenLight },
  categoryBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: COLORS.green, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  categoryBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4, lineHeight: 18 },
  cardMeta: { marginBottom: 5 },
  metaText: { fontSize: 11, color: COLORS.muted, marginBottom: 2 },
  price: { fontSize: 16, fontWeight: '800', color: COLORS.green },
  currency: { fontSize: 12, fontWeight: '400', color: COLORS.muted },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 10 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  avatarInitial: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.greenLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 10, fontWeight: '800', color: COLORS.green },
  sellerName: { fontSize: 11, color: COLORS.muted, flex: 1 },
  buyBtn: { backgroundColor: COLORS.green, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  buyBtnText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  loadingText: { marginTop: 12, color: COLORS.muted, fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  emptySub: { fontSize: 14, color: COLORS.muted },
});
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Linking, Dimensions, FlatList,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import MapView, { Marker } from '../components/MapViewWrapper';
import { useAuth } from '../context/AuthContext';
import { marketplaceService as api } from '../services/api';

const { width } = Dimensions.get('window');
const COLORS = {
  green: '#1a7a4a', greenLight: '#e8f5ee', greenDark: '#0d4a28',
  amber: '#e8800a', amberLight: '#fff3e0', white: '#ffffff',
  surface: '#f4f7f5', text: '#1c2620', muted: '#6b7c72', border: '#d0dbd4', red: '#d63b3b',
};
const PLACEHOLDER = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80';

export default function ListingDetailScreen({ route, navigation }) {
  const { listingId, openBuy } = route.params || {};
  const { user } = useAuth();
  const [listing,      setListing]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [imgIndex,     setImgIndex]     = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);
  const [payMethod,    setPayMethod]    = useState('MTN Mobile Money');
  const [payNumber,    setPayNumber]    = useState('');
  const [processing,   setProcessing]   = useState(false);

  useEffect(() => {
    loadListing();
  }, [listingId]);

  useEffect(() => {
    if (openBuy && listing && user) setPaymentModal(true);
  }, [listing, openBuy]);

  const loadListing = async () => {
    try {
      const data = await api.getListing(listingId);
      setListing(data);
    } catch {
      Alert.alert('Error', 'Could not load listing');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to buy this item.', [
        { text: 'Cancel' },
        { text: 'Log In', onPress: () => navigation.navigate('Auth') },
      ]);
      return;
    }
    if (listing.sellerId === user.id) {
      Alert.alert('Cannot Buy', 'You cannot buy your own listing.');
      return;
    }
    setPaymentModal(true);
  };

  const handlePay = async () => {
    if (!payNumber.trim()) return Alert.alert('Error', 'Enter your payment number');
    setProcessing(true);
    try {
      const fee   = Math.round(listing.price * 0.02);
      const total = listing.price + fee;
      await api.createOrder({
        listingId: listing.id,
        paymentMethod: payMethod,
        paymentNumber: payNumber,
        amount: total,
      });
      setPaymentModal(false);
      setPayNumber('');
      Alert.alert('Payment Successful! ✅', `Your order for "${listing.title}" has been placed. The seller will contact you shortly.`, [
        { text: 'View My Orders', onPress: () => navigation.navigate('Profile', { tab: 'orders' }) },
        { text: 'OK' },
      ]);
    } catch (err) {
      Alert.alert('Payment Failed', err.message || 'Could not process payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  const images = listing.images?.length ? listing.images.map(i => i.url) : [PLACEHOLDER];
  const fee    = Math.round(listing.price * 0.02);
  const total  = listing.price + fee;

  const PM_OPTIONS = ['MTN Mobile Money', 'Orange Money', 'Bank Transfer'];

  return (
    <View style={styles.container}>
      {/* IMAGE CAROUSEL */}
      <View style={styles.imageContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={e => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item }) => (
            <Image source={{ uri: item || PLACEHOLDER }} style={styles.heroImage} resizeMode="cover" />
          )}
          keyExtractor={(_, i) => i.toString()}
        />
        {/* Dots */}
        {images.length > 1 && (
          <View style={styles.dotRow}>
            {images.map((_, i) => <View key={i} style={[styles.dot, i === imgIndex && styles.dotActive]} />)}
          </View>
        )}
        {/* Back btn */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        {/* Category badge */}
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{listing.category}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* PRICE + TITLE */}
        <View style={styles.section}>
          <Text style={styles.price}>{Number(listing.price).toLocaleString()} XAF</Text>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.metaRow}>
            <MetaChip icon="📍" text={listing.city} />
            <MetaChip icon="📦" text={listing.quantity} />
            <MetaChip icon="⚙️" text={listing.condition} />
          </View>
          <Text style={styles.createdAt}>Posted {listing.createdAt?.slice(0,10)}</Text>
        </View>

        {/* DESCRIPTION */}
        {!!listing.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
        )}

        {/* SELLER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>{(listing.seller || 'A')[0].toUpperCase()}</Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{listing.seller}</Text>
              <Text style={styles.sellerPhone}>{listing.phone}</Text>
            </View>
            {!!listing.phone && (
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Linking.openURL(`tel:${listing.phone}`)}>
                <Text style={styles.callBtnText}>📞 Call</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* MAP */}
        {listing.latitude && listing.longitude ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Location</Text>
            <View style={styles.mapContainer}>
              <MapView
                
                style={styles.map}
                initialRegion={{
                  latitude: listing.latitude,
                  longitude: listing.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}>
                <Marker
                  coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
                  title={listing.title}
                  description={listing.city}
                />
              </MapView>
              <TouchableOpacity
                style={styles.openMapsBtn}
                onPress={() => Linking.openURL(`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`)}>
                <Text style={styles.openMapsBtnText}>Open in Google Maps →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BOTTOM BUY BAR */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>{Number(listing.price).toLocaleString()} XAF</Text>
          <Text style={styles.bottomQty}>{listing.quantity}</Text>
        </View>
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuy}>
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* PAYMENT MODAL */}
      <Modal visible={paymentModal} animationType="slide" transparent onRequestClose={() => setPaymentModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Secure Payment</Text>

              {/* Order summary */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>{listing.title}</Text>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Price</Text><Text style={styles.summaryVal}>{Number(listing.price).toLocaleString()} XAF</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Service fee (2%)</Text><Text style={styles.summaryVal}>{fee.toLocaleString()} XAF</Text></View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>Total</Text>
                  <Text style={styles.summaryTotalVal}>{total.toLocaleString()} XAF</Text>
                </View>
              </View>

              {/* Payment method */}
              <Text style={styles.fieldLabel}>Payment Method</Text>
              <View style={styles.pmTabs}>
                {PM_OPTIONS.map(pm => (
                  <TouchableOpacity
                    key={pm}
                    style={[styles.pmTab, payMethod === pm && styles.pmTabActive]}
                    onPress={() => setPayMethod(pm)}>
                    <Text style={[styles.pmTabText, payMethod === pm && styles.pmTabTextActive]} numberOfLines={1}>
                      {pm}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {payMethod !== 'Bank Transfer' ? (
                <View>
                  <Text style={styles.fieldLabel}>{payMethod} Number</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="+237 6XX XXX XXX"
                    value={payNumber}
                    onChangeText={setPayNumber}
                    keyboardType="phone-pad"
                    placeholderTextColor={COLORS.muted}
                  />
                </View>
              ) : (
                <View style={styles.bankBox}>
                  <Text style={styles.bankLabel}>Transfer to:</Text>
                  <Text style={styles.bankDetail}>Bank: Afriland First Bank</Text>
                  <Text style={styles.bankDetail}>Account: 10023-ECOTRADE-88</Text>
                  <Text style={[styles.bankDetail, { color: COLORS.green, fontWeight: '700' }]}>Amount: {total.toLocaleString()} XAF</Text>
                </View>
              )}

              <View style={styles.secureRow}>
                <Text style={{ color: COLORS.green }}>🔒</Text>
                <Text style={styles.secureText}>256-bit SSL encrypted · Payment info never stored</Text>
              </View>

              <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={processing}>
                {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.payBtnText}>Pay {total.toLocaleString()} XAF</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setPaymentModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function MetaChip({ icon, text }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{icon} {text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageContainer: { position: 'relative', height: 280 },
  heroImage: { width, height: 280, backgroundColor: COLORS.greenLight },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  heroBadge: { position: 'absolute', top: 50, right: 16, backgroundColor: COLORS.green, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  heroBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  dotRow: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: COLORS.white, width: 18 },
  content: { flex: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  price: { fontSize: 28, fontWeight: '800', color: COLORS.green, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: COLORS.greenLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  chipText: { fontSize: 12, color: COLORS.green, fontWeight: '600' },
  createdAt: { fontSize: 12, color: COLORS.muted, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  description: { fontSize: 14, color: COLORS.muted, lineHeight: 22 },
  sellerCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sellerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center' },
  sellerAvatarText: { color: COLORS.white, fontWeight: '800', fontSize: 18 },
  sellerInfo: { flex: 1 },
  sellerName: { fontWeight: '700', fontSize: 15, color: COLORS.text },
  sellerPhone: { fontSize: 13, color: COLORS.muted },
  callBtn: { backgroundColor: COLORS.greenLight, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  callBtnText: { color: COLORS.green, fontWeight: '700', fontSize: 13 },
  mapContainer: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  map: { height: 200 },
  openMapsBtn: { backgroundColor: COLORS.greenLight, padding: 10, alignItems: 'center' },
  openMapsBtnText: { color: COLORS.green, fontWeight: '600', fontSize: 13 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, paddingBottom: Platform.OS === 'ios' ? 28 : 14 },
  bottomPrice: { fontSize: 20, fontWeight: '800', color: COLORS.green },
  bottomQty: { fontSize: 12, color: COLORS.muted },
  buyBtn: { backgroundColor: COLORS.green, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  buyBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 20 },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  summaryBox: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 16 },
  summaryTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { fontSize: 13, color: COLORS.muted },
  summaryVal: { fontSize: 13, color: COLORS.text },
  summaryTotal: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 6, paddingTop: 8 },
  summaryTotalLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  summaryTotalVal: { fontSize: 15, fontWeight: '800', color: COLORS.green },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  pmTabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  pmTab: { flex: 1, padding: 8, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
  pmTabActive: { backgroundColor: COLORS.greenLight, borderColor: COLORS.green },
  pmTabText: { fontSize: 11, fontWeight: '600', color: COLORS.muted, textAlign: 'center' },
  pmTabTextActive: { color: COLORS.green },
  modalInput: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, color: COLORS.text, marginBottom: 12 },
  bankBox: { backgroundColor: COLORS.greenLight, borderRadius: 10, padding: 12, marginBottom: 12 },
  bankLabel: { fontWeight: '700', color: COLORS.green, marginBottom: 4 },
  bankDetail: { fontSize: 13, color: COLORS.text, marginBottom: 2 },
  secureRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  secureText: { fontSize: 12, color: COLORS.muted },
  payBtn: { backgroundColor: COLORS.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  payBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  cancelBtn: { alignItems: 'center', paddingVertical: 8 },
  cancelBtnText: { color: COLORS.muted, fontWeight: '600' },
});
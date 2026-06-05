import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Image, Modal,
  Platform, KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { marketplaceService as api } from '../services/api';

const COLORS = {
  green: '#1a7a4a', greenLight: '#e8f5ee', greenDark: '#0d4a28',
  amber: '#e8800a', amberLight: '#fff3e0', white: '#ffffff',
  surface: '#f4f7f5', text: '#1c2620', muted: '#6b7c72', border: '#d0dbd4', red: '#d63b3b',
};

const PM_TYPES = ['MTN Mobile Money', 'Orange Money', 'Bank Transfer'];

export default function ProfileScreen({ navigation, route }) {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab,   setActiveTab]   = useState(route?.params?.tab || 'profile');
  const [saving,      setSaving]      = useState(false);
  const [addingPm,    setAddingPm]    = useState(false);
  const [pmModal,     setPmModal]     = useState(false);
  const [pmType,      setPmType]      = useState('MTN Mobile Money');
  const [pmNumber,    setPmNumber]    = useState('');
  const [pmName,      setPmName]      = useState('');
  const [orders,      setOrders]      = useState([]);
  const [myListings,  setMyListings]  = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Profile form
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName,  setLastName]  = useState(user?.lastName  || '');
  const [phone,     setPhone]     = useState(user?.phone     || '');
  const [city,      setCity]      = useState(user?.city      || '');
  const [idNumber,  setIdNumber]  = useState(user?.idNumber  || '');
  const [bio,       setBio]       = useState(user?.bio       || '');

  useEffect(() => {
    if (activeTab === 'orders')   loadOrders();
    if (activeTab === 'listings') loadMyListings();
  }, [activeTab]);

  const loadOrders = async () => {
    setLoadingData(true);
    try { const data = await api.getMyOrders(); setOrders(data); }
    catch (e) { console.error(e); }
    finally { setLoadingData(false); }
  };

  const loadMyListings = async () => {
    setLoadingData(true);
    try { const data = await api.getMyListings(); setMyListings(data); }
    catch (e) { console.error(e); }
    finally { setLoadingData(false); }
  };

  const completionFields = [firstName, lastName, user?.email, phone, city, idNumber];
  const filledCount = completionFields.filter(Boolean).length;
  const hasPayment  = (user?.paymentAccounts?.length || 0) > 0;
  const pct         = Math.round(((filledCount / completionFields.length) * 0.75 + (hasPayment ? 0.25 : 0)) * 100);
  const profileComplete = pct >= 95;

  const saveProfile = async () => {
    if (!firstName || !lastName) return Alert.alert('Required', 'First and last name are required');
    setSaving(true);
    try {
      await api.updateMe({ firstName, lastName, phone, city, idNumber, bio });
      await refreshUser();
      Alert.alert('Saved ✅', 'Your profile has been updated.');
    } catch (err) {
      Alert.alert('Error', err.error || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled) {
      try {
        await api.uploadAvatar(result.assets[0].uri);
        await refreshUser();
      } catch (err) {
        Alert.alert('Error', 'Could not upload avatar');
      }
    }
  };

  const addPayment = async () => {
    if (!pmNumber.trim()) return Alert.alert('Required', 'Enter account number');
    setAddingPm(true);
    try {
      await api.addPayment({ type: pmType, number: pmNumber, accountName: pmName });
      await refreshUser();
      setPmModal(false);
      setPmNumber(''); setPmName('');
      Alert.alert('Added ✅', `${pmType} has been linked.`);
    } catch (err) {
      Alert.alert('Error', err.error || 'Could not add payment method');
    } finally {
      setAddingPm(false);
    }
  };

  const removePayment = (id) => {
    Alert.alert('Remove', 'Remove this payment account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        await api.deletePayment(id);
        await refreshUser();
      }},
    ]);
  };

 const handleLogout = () => {
  if (typeof window !== 'undefined') {
    if (window.confirm('Are you sure you want to log out?')) logout();
  } else {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  }
};

  const TABS = [
    { key: 'profile', label: 'Profile' },
    { key: 'payments', label: 'Payments' },
    { key: 'listings', label: 'Listings' },
    { key: 'orders', label: 'Orders' },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickAvatar} style={styles.avatarContainer}>
          {user?.avatar
            ? <Image source={{ uri: user.avatar }} style={styles.avatar} />
            : <View style={styles.avatarInitial}><Text style={styles.avatarText}>{(user?.firstName||'?')[0]}{(user?.lastName||'')[0]}</Text></View>
          }
          <View style={styles.avatarEdit}><Text style={{ color: COLORS.white, fontSize: 11 }}>Edit</Text></View>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
          <View style={[styles.badge, profileComplete ? styles.badgeGreen : styles.badgeAmber]}>
            <Text style={styles.badgeText}>{profileComplete ? '✅ Profile Complete' : '⚠️ Incomplete'}</Text>
          </View>
        </View>
      </View>

      {/* COMPLETION BAR */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Profile completion</Text>
          <Text style={styles.progressPct}>{pct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        {!profileComplete && (
          <Text style={styles.progressHint}>
            {!hasPayment ? '⚠️ Add a payment account to start selling' : `Fill in remaining fields: ${6 - filledCount} left`}
          </Text>
        )}
      </View>

      {/* TABS */}
      <View style={styles.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[styles.tab, activeTab === t.key && styles.tabActive]} onPress={() => setActiveTab(t.key)}>
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <View style={styles.section}>
            <View style={styles.formRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Field label="First Name *" value={firstName} onChangeText={setFirstName} placeholder="Marie" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Last Name *" value={lastName} onChangeText={setLastName} placeholder="Nguema" />
              </View>
            </View>
            <Field label="Email" value={user?.email || ''} editable={false} style={styles.disabledInput} />
            <Field label="Phone *" value={phone} onChangeText={setPhone} placeholder="+237 6XX XXX XXX" keyboardType="phone-pad" />
            <View style={styles.formRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Field label="City *" value={city} onChangeText={setCity} placeholder="Yaoundé" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="National ID *" value={idNumber} onChangeText={setIdNumber} placeholder="CM-XXXXXXXXX" />
              </View>
            </View>
            <Field label="Bio" value={bio} onChangeText={setBio} placeholder="Tell buyers about yourself…" multiline numberOfLines={3} style={{ minHeight: 70 }} />
            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Profile</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── PAYMENTS TAB ── */}
        {activeTab === 'payments' && (
          <View style={styles.section}>
            {!hasPayment && (
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningText}>You must add at least one payment account to post listings and receive payments from buyers.</Text>
              </View>
            )}
            {(user?.paymentAccounts || []).map(pm => (
              <View key={pm.id} style={styles.paymentCard}>
                <View style={styles.pmLogoBox}>
                  <Text style={styles.pmLogoText}>{pm.type === 'MTN Mobile Money' ? 'MTN' : pm.type === 'Orange Money' ? 'OM' : 'BNK'}</Text>
                </View>
                <View style={styles.pmInfo}>
                  <Text style={styles.pmType}>{pm.type}</Text>
                  <Text style={styles.pmNumber}>{pm.number}</Text>
                </View>
                <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>Verified</Text></View>
                <TouchableOpacity onPress={() => removePayment(pm.id)} style={styles.pmRemove}>
                  <Text style={styles.pmRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPaymentBtn} onPress={() => setPmModal(true)}>
              <Text style={styles.addPaymentBtnText}>+ Add Payment Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── LISTINGS TAB ── */}
        {activeTab === 'listings' && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.newListingBtn} onPress={() => navigation.navigate('CreateListing')}>
              <Text style={styles.newListingBtnText}>+ New Listing</Text>
            </TouchableOpacity>
            {loadingData
              ? <ActivityIndicator color={COLORS.green} style={{ marginTop: 30 }} />
              : myListings.length === 0
                ? <EmptyState icon="📭" title="No listings yet" sub="Post your first recyclable material above" />
                : myListings.map(l => (
                    <TouchableOpacity key={l.id} style={styles.listingRow} onPress={() => navigation.navigate('ListingDetail', { listingId: l.id })}>
                      <Image source={{ uri: l.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200' }} style={styles.listingRowImg} />
                      <View style={styles.listingRowInfo}>
                        <Text style={styles.listingRowTitle} numberOfLines={1}>{l.title}</Text>
                        <Text style={styles.listingRowMeta}>{l.city} · {l.quantity}</Text>
                        <Text style={styles.listingRowPrice}>{Number(l.price).toLocaleString()} XAF</Text>
                      </View>
                    </TouchableOpacity>
                  ))
            }
          </View>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <View style={styles.section}>
            {loadingData
              ? <ActivityIndicator color={COLORS.green} style={{ marginTop: 30 }} />
              : orders.length === 0
                ? <EmptyState icon="🧾" title="No orders yet" sub="Your purchases will appear here" />
                : orders.map(o => (
                    <View key={o.id} style={styles.orderCard}>
                      <View style={styles.orderHeader}>
                        <Text style={styles.orderTitle} numberOfLines={1}>{o.listing_title}</Text>
                        <View style={[styles.orderStatus, o.status === 'paid' ? styles.statusPaid : styles.statusPending]}>
                          <Text style={styles.orderStatusText}>{o.status === 'paid' ? '✅ Paid' : '⏳ Pending'}</Text>
                        </View>
                      </View>
                      <Text style={styles.orderSeller}>Seller: {o.seller_first} {o.seller_last}</Text>
                      <View style={styles.orderFooter}>
                        <Text style={styles.orderMethod}>{o.payment_method}</Text>
                        <Text style={styles.orderAmount}>{Number(o.amount).toLocaleString()} XAF</Text>
                      </View>
                      <Text style={styles.orderDate}>{o.created_at?.slice(0,10)}</Text>
                    </View>
                  ))
            }
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ADD PAYMENT MODAL */}
      <Modal visible={pmModal} animationType="slide" transparent onRequestClose={() => setPmModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Add Payment Account</Text>

              <Text style={styles.fieldLabel}>Account Type</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                {PM_TYPES.map(t => (
                  <TouchableOpacity key={t} style={[styles.pmTypeTab, pmType === t && styles.pmTypeTabActive]} onPress={() => setPmType(t)}>
                    <Text style={[styles.pmTypeTabText, pmType === t && styles.pmTypeTabTextActive]} numberOfLines={2}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Field label={pmType === 'Bank Transfer' ? 'Account Number *' : 'Phone Number *'} value={pmNumber} onChangeText={setPmNumber} placeholder={pmType === 'Bank Transfer' ? 'Account number' : '+237 6XX XXX XXX'} keyboardType="phone-pad" />
              <Field label="Account Name (optional)" value={pmName} onChangeText={setPmName} placeholder="Name on account" />

              <TouchableOpacity style={styles.saveBtn} onPress={addPayment} disabled={addingPm}>
                {addingPm ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Add Account</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setPmModal(false)}>
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function Field({ label, style, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <TextInput style={[styles.input, props.multiline && { textAlignVertical: 'top' }, style]} placeholderTextColor={COLORS.muted} {...props} />
    </View>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 50 }}>
      <Text style={{ fontSize: 44, marginBottom: 12 }}>{icon}</Text>
      <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 4 }}>{title}</Text>
      <Text style={{ fontSize: 14, color: COLORS.muted, textAlign: 'center' }}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { backgroundColor: COLORS.greenDark, paddingTop: 54, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: COLORS.white },
  avatarInitial: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  avatarText: { color: COLORS.white, fontSize: 24, fontWeight: '800' },
  avatarEdit: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.amber, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2 },
  headerInfo: { flex: 1 },
  headerName: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  headerEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeGreen: { backgroundColor: 'rgba(127,255,196,0.2)' },
  badgeAmber: { backgroundColor: 'rgba(232,128,10,0.2)' },
  badgeText: { fontSize: 12, color: COLORS.white, fontWeight: '600' },
  progressSection: { backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 13, color: COLORS.muted },
  progressPct: { fontSize: 13, fontWeight: '700', color: COLORS.green },
  progressTrack: { height: 7, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 4 },
  progressHint: { fontSize: 12, color: COLORS.amber, marginTop: 6 },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1.5, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent', marginBottom: -1.5 },
  tabActive: { borderBottomColor: COLORS.green },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  tabTextActive: { color: COLORS.green },
  content: { flex: 1 },
  section: { backgroundColor: COLORS.white, margin: 10, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  formRow: { flexDirection: 'row' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.surface },
  disabledInput: { backgroundColor: '#eee', color: COLORS.muted },
  saveBtn: { backgroundColor: COLORS.green, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  saveBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  logoutBtn: { backgroundColor: COLORS.surface, borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 10, borderWidth: 1.5, borderColor: COLORS.red },
  logoutBtnText: { color: COLORS.red, fontWeight: '700', fontSize: 15 },
  warningBox: { flexDirection: 'row', backgroundColor: COLORS.amberLight, borderRadius: 12, padding: 12, gap: 10, marginBottom: 16, borderWidth: 1, borderColor: COLORS.amber },
  warningIcon: { fontSize: 20 },
  warningText: { flex: 1, fontSize: 13, color: '#7a4e00', lineHeight: 20 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  pmLogoBox: { width: 44, height: 28, backgroundColor: COLORS.white, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pmLogoText: { fontSize: 10, fontWeight: '800', color: COLORS.green },
  pmInfo: { flex: 1 },
  pmType: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  pmNumber: { fontSize: 12, color: COLORS.muted },
  verifiedBadge: { backgroundColor: COLORS.greenLight, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedText: { fontSize: 11, color: COLORS.green, fontWeight: '700' },
  pmRemove: { padding: 4 },
  pmRemoveText: { color: COLORS.red, fontSize: 16 },
  addPaymentBtn: { borderWidth: 1.5, borderColor: COLORS.green, borderStyle: 'dashed', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  addPaymentBtnText: { color: COLORS.green, fontWeight: '700', fontSize: 15 },
  newListingBtn: { backgroundColor: COLORS.green, borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginBottom: 16 },
  newListingBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  listingRow: { flexDirection: 'row', gap: 12, backgroundColor: COLORS.surface, borderRadius: 12, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  listingRowImg: { width: 64, height: 64, borderRadius: 10 },
  listingRowInfo: { flex: 1, justifyContent: 'center' },
  listingRowTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text },
  listingRowMeta: { fontSize: 12, color: COLORS.muted, marginVertical: 3 },
  listingRowPrice: { fontSize: 14, fontWeight: '800', color: COLORS.green },
  orderCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  orderHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  orderTitle: { flex: 1, fontWeight: '700', fontSize: 14, color: COLORS.text },
  orderStatus: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  statusPaid: { backgroundColor: COLORS.greenLight },
  statusPending: { backgroundColor: COLORS.amberLight },
  orderStatusText: { fontSize: 11, fontWeight: '700' },
  orderSeller: { fontSize: 12, color: COLORS.muted, marginBottom: 6 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  orderMethod: { fontSize: 12, color: COLORS.muted },
  orderAmount: { fontSize: 14, fontWeight: '800', color: COLORS.green },
  orderDate: { fontSize: 11, color: COLORS.muted, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 20 },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  pmTypeTab: { flex: 1, padding: 8, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
  pmTypeTabActive: { backgroundColor: COLORS.greenLight, borderColor: COLORS.green },
  pmTypeTabText: { fontSize: 11, fontWeight: '600', color: COLORS.muted, textAlign: 'center' },
  pmTypeTabTextActive: { color: COLORS.green },
  cancelModalBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 4 },
  cancelModalText: { color: COLORS.muted, fontWeight: '600', fontSize: 15 },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Animated, StatusBar,
} from 'react-native';
import { marketplaceService as marketApi } from '../../../services/api';
import { useAuth } from '../../../shared/context/AuthContext';
 
const C = {
  primary: '#1B5E20', mid: '#2E7D32', light: '#4CAF50',
  white: '#ffffff', surface: '#F5F7F5', text: '#1A1A1A',
  muted: '#6B6B6B', border: '#E0E0E0', red: '#C62828', inputBg: '#F9FBF9',
};
 
const ROLES = [
  { id: 'citizen',     label: 'Citizen',     desc: 'Report waste incidents & trade recyclables' },
  { id: 'association', label: 'Association',  desc: 'Organise cleanup campaigns in your area' },
  { id: 'government',  label: 'Government',   desc: 'Monitor & coordinate citywide waste management' },
];
 
export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [step,    setStep]    = useState(1);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [role,    setRole]    = useState('citizen');
  const [showP,   setShowP]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [focused, setFocused] = useState('');
 
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progress  = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);
 
  useEffect(() => {
    Animated.timing(progress, {
      toValue: step === 1 ? 0.5 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [step]);
 
  const shake = () => Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 6,   duration: 55, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
  ]).start();
 
  const goStep2 = () => {
    setError('');
    if (!name.trim())     { setError('Full name is required'); shake(); return; }
    if (!email.trim())    { setError('Email address is required'); shake(); return; }
    if (pass.length < 6)  { setError('Password must be at least 6 characters'); shake(); return; }
    if (pass !== confirm) { setError('Passwords do not match'); shake(); return; }
    setStep(2);
  };
 
  const handleRegister = async () => {
    setError(''); setLoading(true);
    try {
      const parts = name.trim().split(' ');
      const firstName = parts[0];
      const lastName  = parts.slice(1).join(' ') || parts[0];
      await marketApi.register({ firstName, lastName, email: email.trim(), password: pass, role });
      await login(email.trim(), pass);
    } catch (err) {
      setError(err.error || err.response?.data?.message || 'Registration failed. Please try again.');
      shake();
    } finally { setLoading(false); }
  };
 
  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
 
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <ScrollView contentContainerStyle={S.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
 
        {/* HEADER */}
        <View style={S.header}>
          <View style={[S.blob, { width:200, height:200, top:-60, right:-50 }]} />
          <View style={[S.blob, { width:120, height:120, bottom:-30, left:-30 }]} />
          <TouchableOpacity style={S.backBtn} onPress={() => step === 2 ? setStep(1) : navigation.goBack()}>
            <Text style={S.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={S.headerTitle}>Create Account</Text>
          <Text style={S.headerSub}>Step {step} of 2</Text>
          <View style={S.progressTrack}>
            <Animated.View style={[S.progressFill, { width: progressWidth }]} />
          </View>
        </View>
 
        {/* CARD */}
        <Animated.View style={[S.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
 
          {!!error && (
            <Animated.View style={[S.errorBox, { transform: [{ translateX: shakeAnim }] }]}>
              <View style={S.errorDot} />
              <Text style={S.errorText}>{error}</Text>
            </Animated.View>
          )}
 
          {step === 1 ? (
            <>
              <Text style={S.stepTitle}>Personal Information</Text>
              <Text style={S.stepSub}>Tell us a bit about yourself</Text>
 
              <Field label="Full Name"     value={name}    onChangeText={setName}    placeholder="Marie Nguema"    name="name"    focused={focused} setFocused={setFocused} />
              <Field label="Email Address" value={email}   onChangeText={setEmail}   placeholder="you@example.com" name="email"   focused={focused} setFocused={setFocused} keyboardType="email-address" autoCapitalize="none" />
 
              <View style={S.fieldGroup}>
                <Text style={S.label}>Password</Text>
                <View style={[S.inputRow, focused === 'pass' && S.inputRowFocused]}>
                  <TextInput style={[S.input, { flex:1 }]} placeholder="Minimum 6 characters"
                    placeholderTextColor={C.muted} value={pass} onChangeText={setPass}
                    secureTextEntry={!showP} onFocus={() => setFocused('pass')} onBlur={() => setFocused('')} />
                  <TouchableOpacity onPress={() => setShowP(!showP)} style={S.toggleBtn}>
                    <Text style={S.toggleText}>{showP ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
 
              <Field label="Confirm Password" value={confirm} onChangeText={setConfirm}
                placeholder="Repeat your password" name="confirm" focused={focused}
                setFocused={setFocused} secureTextEntry={!showP} />
 
              <TouchableOpacity style={S.primaryBtn} onPress={goStep2} activeOpacity={0.9}>
                <Text style={S.primaryBtnText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={S.stepTitle}>Account Type</Text>
              <Text style={S.stepSub}>Select the role that best describes you</Text>
 
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={[S.roleCard, role === r.id && S.roleCardActive]}
                  onPress={() => setRole(r.id)}
                  activeOpacity={0.85}>
                  <View style={S.roleContent}>
                    <Text style={[S.roleLabel, role === r.id && S.roleLabelActive]}>{r.label}</Text>
                    <Text style={S.roleDesc}>{r.desc}</Text>
                  </View>
                  <View style={[S.radio, role === r.id && S.radioActive]}>
                    {role === r.id && <View style={S.radioFill} />}
                  </View>
                </TouchableOpacity>
              ))}
 
              <TouchableOpacity style={[S.primaryBtn, { marginTop: 8 }]} onPress={handleRegister} disabled={loading} activeOpacity={0.9}>
                {loading
                  ? <ActivityIndicator color={C.white} />
                  : <Text style={S.primaryBtnText}>Create Account</Text>
                }
              </TouchableOpacity>
            </>
          )}
 
          <View style={S.footer}>
            <Text style={S.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={S.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
function Field({ label, name, focused, setFocused, ...props }) {
  return (
    <View style={S.fieldGroup}>
      <Text style={S.label}>{label}</Text>
      <View style={[S.inputRow, focused === name && S.inputRowFocused]}>
        <TextInput style={S.input} placeholderTextColor={C.muted}
          onFocus={() => setFocused(name)} onBlur={() => setFocused('')} {...props} />
      </View>
    </View>
  );
}
 
const S = StyleSheet.create({
  scroll:          { flexGrow: 1, backgroundColor: C.surface },
  header:          { backgroundColor: C.primary, paddingTop: 54, paddingBottom: 36, paddingHorizontal: 28, position: 'relative', overflow: 'hidden' },
  blob:            { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)' },
  backBtn:         { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 14 },
  backText:        { color: C.white, fontSize: 13, fontWeight: '600' },
  headerTitle:     { color: C.white, fontSize: 26, fontWeight: '800' },
  headerSub:       { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4, marginBottom: 18 },
  progressTrack:   { height: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill:    { height: '100%', backgroundColor: C.light, borderRadius: 3 },
  card:            { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -16, paddingHorizontal: 28, paddingTop: 30, paddingBottom: 40, flex: 1 },
  stepTitle:       { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 },
  stepSub:         { fontSize: 14, color: C.muted, marginBottom: 26, lineHeight: 20 },
  errorBox:        { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF5F5', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  errorDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: C.red, flexShrink: 0 },
  errorText:       { color: C.red, fontSize: 13, fontWeight: '500', flex: 1, lineHeight: 18 },
  fieldGroup:      { marginBottom: 18 },
  label:           { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 7, letterSpacing: 0.1 },
  inputRow:        { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.border, borderRadius: 12, backgroundColor: C.inputBg, paddingHorizontal: 16, height: 50 },
  inputRowFocused: { borderColor: C.light, backgroundColor: '#F0F9F1' },
  input:           { flex: 1, fontSize: 15, color: C.text },
  toggleBtn:       { paddingHorizontal: 6, paddingVertical: 4 },
  toggleText:      { fontSize: 13, color: C.mid, fontWeight: '600' },
  primaryBtn:      { backgroundColor: C.mid, borderRadius: 12, paddingVertical: 15, alignItems: 'center', shadowColor: C.primary, shadowOffset: { width:0, height:3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 },
  primaryBtnText:  { color: C.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  roleCard:        { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: C.border },
  roleCardActive:  { borderColor: C.mid, backgroundColor: '#F0F9F1' },
  roleContent:     { flex: 1 },
  roleLabel:       { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 3 },
  roleLabelActive: { color: C.mid },
  roleDesc:        { fontSize: 12, color: C.muted, lineHeight: 17 },
  radio:           { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  radioActive:     { borderColor: C.mid },
  radioFill:       { width: 12, height: 12, borderRadius: 6, backgroundColor: C.mid },
  footer:          { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText:      { fontSize: 14, color: C.muted },
  footerLink:      { fontSize: 14, color: C.mid, fontWeight: '700' },
});
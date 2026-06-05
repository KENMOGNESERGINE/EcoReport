import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
 
const { height } = Dimensions.get('window');
const C = {
  primary: '#1B5E20', mid: '#2E7D32', light: '#4CAF50',
  white: '#ffffff', surface: '#F5F7F5', text: '#1A1A1A',
  muted: '#6B6B6B', border: '#E0E0E0', red: '#C62828',
  google: '#4285F4', inputBg: '#F9FBF9',
};
 
export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [focused,  setFocused]  = useState('');
 
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(50)).current;
  const logoScale  = useRef(new Animated.Value(0.4)).current;
  const shakeAnim  = useRef(new Animated.Value(0)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;
 
  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 9, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);
 
  const shake = () => Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 6,   duration: 55, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
  ]).start();
 
  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) { setError('Please enter your email and password'); shake(); return; }
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 75, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 75, useNativeDriver: true }),
    ]).start();
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.error || err.response?.data?.message || 'Incorrect email or password');
      shake();
    } finally { setLoading(false); }
  };
 
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <ScrollView contentContainerStyle={S.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
 
        {/* HEADER */}
        <View style={S.header}>
          <View style={[S.blob, { width:220, height:220, top:-70, right:-60, opacity:0.08 }]} />
          <View style={[S.blob, { width:160, height:160, bottom:-40, left:-50, opacity:0.06 }]} />
          <Animated.View style={[S.logoWrap, { transform: [{ scale: logoScale }] }]}>
            <View style={S.logoInner}>
              <Text style={S.logoText}>E</Text>
            </View>
          </Animated.View>
          <Animated.Text style={[S.appName, { opacity: fadeAnim }]}>EcoReport</Animated.Text>
          <Animated.Text style={[S.appTagline, { opacity: fadeAnim }]}>
            Waste Reporting & Recycling Marketplace
          </Animated.Text>
        </View>
 
        {/* FORM CARD */}
        <Animated.View style={[S.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={S.cardTitle}>Sign In</Text>
          <Text style={S.cardSub}>Enter your credentials to continue</Text>
 
          {!!error && (
            <Animated.View style={[S.errorBox, { transform: [{ translateX: shakeAnim }] }]}>
              <View style={S.errorDot} />
              <Text style={S.errorText}>{error}</Text>
            </Animated.View>
          )}
 
          {/* EMAIL */}
          <View style={S.fieldGroup}>
            <Text style={S.label}>Email address</Text>
            <View style={[S.inputRow, focused === 'email' && S.inputRowFocused]}>
              <TextInput
                style={S.input}
                placeholder="you@example.com"
                placeholderTextColor={C.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
              />
            </View>
          </View>
 
          {/* PASSWORD */}
          <View style={S.fieldGroup}>
            <Text style={S.label}>Password</Text>
            <View style={[S.inputRow, focused === 'pass' && S.inputRowFocused]}>
              <TextInput
                style={[S.input, { flex: 1 }]}
                placeholder="Your password"
                placeholderTextColor={C.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                onFocus={() => setFocused('pass')}
                onBlur={() => setFocused('')}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={S.toggleBtn}>
                <Text style={S.toggleText}>{showPass ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>
 
          {/* SIGN IN BUTTON */}
          <Animated.View style={[{ transform: [{ scale: btnScale }] }, S.btnWrap]}>
            <TouchableOpacity style={S.primaryBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.9}>
              {loading
                ? <ActivityIndicator color={C.white} />
                : <Text style={S.primaryBtnText}>Sign In</Text>
              }
            </TouchableOpacity>
          </Animated.View>
 
          {/* DIVIDER */}
          <View style={S.divider}>
            <View style={S.divLine} />
            <Text style={S.divText}>or</Text>
            <View style={S.divLine} />
          </View>
 
          {/* GOOGLE */}
          <TouchableOpacity
            style={S.googleBtn}
            onPress={() => setError('Google Sign-In is coming soon.')}
            activeOpacity={0.85}>
            <View style={S.googleIconBox}>
              <Text style={S.googleLetter}>G</Text>
            </View>
            <Text style={S.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
 
          {/* REGISTER LINK */}
          <View style={S.footer}>
            <Text style={S.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={S.footerLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
const S = StyleSheet.create({
  scroll:         { flexGrow: 1, backgroundColor: C.surface },
  header:         { backgroundColor: C.primary, paddingTop: 64, paddingBottom: 52, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  blob:           { position: 'absolute', borderRadius: 999, backgroundColor: C.white },
  logoWrap:       { marginBottom: 18 },
  logoInner:      { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  logoText:       { fontSize: 30, fontWeight: '800', color: C.white, letterSpacing: -1 },
  appName:        { color: C.white, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  appTagline:     { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 6, textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },
  card:           { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -20, paddingHorizontal: 28, paddingTop: 32, paddingBottom: 40, flex: 1, minHeight: height * 0.58 },
  cardTitle:      { fontSize: 24, fontWeight: '800', color: C.text, marginBottom: 4 },
  cardSub:        { fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 20 },
  errorBox:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF5F5', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  errorDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: C.red, flexShrink: 0 },
  errorText:      { color: C.red, fontSize: 13, fontWeight: '500', flex: 1, lineHeight: 18 },
  fieldGroup:     { marginBottom: 18 },
  label:          { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 7, letterSpacing: 0.1 },
  inputRow:       { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.border, borderRadius: 12, backgroundColor: C.inputBg, paddingHorizontal: 16, height: 50 },
  inputRowFocused:{ borderColor: C.light, backgroundColor: '#F0F9F1' },
  input:          { flex: 1, fontSize: 15, color: C.text },
  toggleBtn:      { paddingHorizontal: 6, paddingVertical: 4 },
  toggleText:     { fontSize: 13, color: C.mid, fontWeight: '600' },
  btnWrap:        { marginTop: 6 },
  primaryBtn:     { backgroundColor: C.mid, borderRadius: 12, paddingVertical: 15, alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 },
  primaryBtnText: { color: C.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  divider:        { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 22 },
  divLine:        { flex: 1, height: 1, backgroundColor: C.border },
  divText:        { fontSize: 12, color: C.muted, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' },
  googleBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, paddingVertical: 13, backgroundColor: C.white },
  googleIconBox:  { width: 24, height: 24, borderRadius: 4, backgroundColor: C.google, alignItems: 'center', justifyContent: 'center' },
  googleLetter:   { color: C.white, fontSize: 14, fontWeight: '800' },
  googleBtnText:  { fontSize: 14, fontWeight: '600', color: C.text },
  footer:         { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText:     { fontSize: 14, color: C.muted },
  footerLink:     { fontSize: 14, color: C.mid, fontWeight: '700' },
});
 
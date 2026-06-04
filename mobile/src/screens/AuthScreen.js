import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  green: '#1a7a4a', greenLight: '#e8f5ee', greenDark: '#0d4a28',
  white: '#ffffff', surface: '#f4f7f5', text: '#1c2620',
  muted: '#6b7c72', border: '#d0dbd4', red: '#d63b3b',
};

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [tab,       setTab]       = useState('login');
  const [loading,   setLoading]   = useState(false);
  const [errorMsg,  setErrorMsg]  = useState('');
  const [successMsg,setSuccessMsg]= useState('');
  const [loginEmail,setLoginEmail]= useState('');
  const [loginPass, setLoginPass] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [suEmail,   setSuEmail]   = useState('');
  const [suPhone,   setSuPhone]   = useState('');
  const [suPass,    setSuPass]    = useState('');

  const showError   = (msg) => { setErrorMsg(msg); setSuccessMsg(''); setTimeout(()=>setErrorMsg(''),4000); };
  const showSuccess = (msg) => { setSuccessMsg(msg); setErrorMsg(''); };

  const handleLogin = async () => {
    setErrorMsg('');
    if (!loginEmail.trim() || !loginPass) { showError('Enter your email and password'); return; }
    setLoading(true);
    try {
      await login(loginEmail.trim(), loginPass);
      showSuccess('Welcome back! Loading your dashboard...');
    } catch (err) {
      console.error('Login error:', JSON.stringify(err));
      showError(err.error || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setErrorMsg('');
    if (!firstName||!lastName||!suEmail||!suPass) { showError('Please fill in all required fields'); return; }
    if (suPass.length < 6) { showError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register({ firstName, lastName, email: suEmail.trim(), phone: suPhone, password: suPass });
      showSuccess('Account created! Welcome to EcoTrade...');
    } catch (err) {
      console.error('Signup error:', JSON.stringify(err));
      showError(err.error || err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.greenDark} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}><Text style={styles.logoIconText}>♻</Text></View>
            <Text style={styles.logoText}>EcoTrade</Text>
          </View>
          <Text style={styles.tagline}>Recycling Marketplace</Text>
          <Text style={styles.subtitle}>Turn waste into worth</Text>
        </View>
        <View style={styles.card}>
          {!!errorMsg && <View style={styles.errorBanner}><Text style={styles.errorText}>❌ {errorMsg}</Text></View>}
          {!!successMsg && <View style={styles.successBanner}><Text style={styles.successText}>✅ {successMsg}</Text></View>}
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, tab==='login'&&styles.tabActive]} onPress={()=>{setTab('login');setErrorMsg('');}}>
              <Text style={[styles.tabText, tab==='login'&&styles.tabTextActive]}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, tab==='signup'&&styles.tabActive]} onPress={()=>{setTab('signup');setErrorMsg('');}}>
              <Text style={[styles.tabText, tab==='signup'&&styles.tabTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          {tab==='login' ? (
            <View>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Field label="Email *" value={loginEmail} onChangeText={setLoginEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
              <Field label="Password *" value={loginPass} onChangeText={setLoginPass} placeholder="••••••••" secureTextEntry />
              <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnPrimaryText}>Log In →</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{setTab('signup');setErrorMsg('');}}>
                <Text style={styles.switchLink}>Don't have an account? <Text style={{color:COLORS.green,fontWeight:'700'}}>Sign up</Text></Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.formTitle}>Create account</Text>
              <View style={styles.row}>
                <View style={{flex:1,marginRight:8}}><Field label="First Name *" value={firstName} onChangeText={setFirstName} placeholder="Marie"/></View>
                <View style={{flex:1}}><Field label="Last Name *" value={lastName} onChangeText={setLastName} placeholder="Nguema"/></View>
              </View>
              <Field label="Email *" value={suEmail} onChangeText={setSuEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none"/>
              <Field label="Phone" value={suPhone} onChangeText={setSuPhone} placeholder="+237 6XX XXX XXX" keyboardType="phone-pad"/>
              <Field label="Password *" value={suPass} onChangeText={setSuPass} placeholder="Min. 6 characters" secureTextEntry/>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleSignup} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnPrimaryText}>Create Account →</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{setTab('login');setErrorMsg('');}}>
                <Text style={styles.switchLink}>Already have an account? <Text style={{color:COLORS.green,fontWeight:'700'}}>Log in</Text></Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({label,...props}) {
  return (
    <View style={{marginBottom:14}}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={COLORS.muted} {...props}/>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll:{flexGrow:1,backgroundColor:COLORS.greenDark},
  header:{paddingTop:60,paddingBottom:32,alignItems:'center'},
  logoRow:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:6},
  logoIcon:{backgroundColor:COLORS.white,borderRadius:12,width:44,height:44,alignItems:'center',justifyContent:'center'},
  logoIconText:{fontSize:22},
  logoText:{color:COLORS.white,fontSize:32,fontWeight:'800'},
  tagline:{color:'rgba(255,255,255,0.7)',fontSize:13,letterSpacing:2,textTransform:'uppercase',marginBottom:4},
  subtitle:{color:'#7fffc4',fontSize:16,fontWeight:'600'},
  card:{backgroundColor:COLORS.white,borderTopLeftRadius:28,borderTopRightRadius:28,padding:24,minHeight:520,flex:1},
  errorBanner:{backgroundColor:'#fde8e8',borderRadius:10,padding:12,marginBottom:14,borderWidth:1,borderColor:COLORS.red},
  errorText:{color:COLORS.red,fontWeight:'600',fontSize:14},
  successBanner:{backgroundColor:COLORS.greenLight,borderRadius:10,padding:12,marginBottom:14,borderWidth:1,borderColor:COLORS.green},
  successText:{color:COLORS.green,fontWeight:'600',fontSize:14},
  tabs:{flexDirection:'row',borderBottomWidth:1.5,borderBottomColor:COLORS.border,marginBottom:20},
  tab:{flex:1,paddingVertical:12,alignItems:'center',borderBottomWidth:2.5,borderBottomColor:'transparent',marginBottom:-1.5},
  tabActive:{borderBottomColor:COLORS.green},
  tabText:{fontSize:15,fontWeight:'600',color:COLORS.muted},
  tabTextActive:{color:COLORS.green},
  formTitle:{fontSize:22,fontWeight:'800',color:COLORS.text,marginBottom:20},
  row:{flexDirection:'row'},
  label:{fontSize:13,fontWeight:'600',color:COLORS.text,marginBottom:5},
  input:{borderWidth:1.5,borderColor:COLORS.border,borderRadius:10,padding:12,fontSize:15,color:COLORS.text,backgroundColor:COLORS.surface},
  btnPrimary:{backgroundColor:COLORS.green,borderRadius:12,paddingVertical:15,alignItems:'center',marginTop:8,marginBottom:14},
  btnPrimaryText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
  switchLink:{textAlign:'center',color:COLORS.muted,fontSize:14},
});

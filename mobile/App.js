import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen          from './src/screens/AuthScreen';
import MarketplaceScreen   from './src/screens/MarketplaceScreen';
import ListingDetailScreen from './src/screens/ListingDetailScreen';
import CreateListingScreen from './src/screens/CreateListingScreen';
import MyListingsScreen    from './src/screens/MyListingsScreen';
import ProfileScreen       from './src/screens/ProfileScreen';
import ReportListScreen    from './src/features/reporting/screens/ReportListScreen';
import ReportDetailScreen  from './src/features/reporting/screens/ReportDetailScreen';
import NewReportScreen     from './src/features/reporting/screens/NewReportScreen';
import MyReportsScreen     from './src/features/reporting/screens/MyReportsScreen';
import EditReportScreen    from './src/features/reporting/screens/EditReportScreen';
import ReportMapScreen     from './src/features/reporting/screens/ReportMapScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();
const COLORS = { green:'#2E7D32', white:'#ffffff', border:'#E0E0E0', muted:'#9E9E9E', greenDark:'#1B5E20' };

function TabIcon({ label, focused }) {
  const icons = { Marketplace:'🛒', Reports:'♻️', 'New Report':'📍', Sell:'➕', Profile:'👤' };
  return (
    <View style={styles.iconWrap}>
      <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>{icons[label] || '●'}</Text>
      <Text style={[styles.iconLabel, focused && styles.iconLabelActive]}>{label}</Text>
    </View>
  );
}

function ReportingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportList"   component={ReportListScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="NewReport"    component={NewReportScreen} />
      <Stack.Screen name="MyReports"    component={MyReportsScreen} />
      <Stack.Screen name="EditReport"   component={EditReportScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.border,
        borderTopWidth: 1.5,
        height: Platform.OS === 'ios' ? 80 : 70,
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
      },
      tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
    })}>
      <Tab.Screen name="Marketplace"  component={MarketplaceScreen} />
      <Tab.Screen name="Reports"      component={ReportingStack} />
      <Tab.Screen name="New Report"   component={NewReportScreen} />
      <Tab.Screen name="Sell"         component={CreateListingScreen} />
      <Tab.Screen name="Profile"      component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>♻ EcoReport</Text>
        <Text style={styles.splashSub}>Waste Reporting and Recycling Marketplace</Text>
        <ActivityIndicator size="large" color="#7fffc4" style={{ marginTop: 24 }} />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main"          component={MainTabs} />
          <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
          <Stack.Screen name="CreateListing" component={CreateListingScreen} />
          <Stack.Screen name="MyListings"    component={MyListingsScreen} />
          <Stack.Screen name="ReportDetail"  component={ReportDetailScreen} />
          <Stack.Screen name="EditReport"    component={EditReportScreen} />
          <Stack.Screen name="ReportMap"     component={ReportMapScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  iconWrap:        { alignItems: 'center', paddingTop: 4 },
  iconLabel:       { fontSize: 10, color: COLORS.muted, marginTop: 2, fontWeight: '600' },
  iconLabelActive: { color: COLORS.green },
  splash:          { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.greenDark },
  splashLogo:      { color: '#7fffc4', fontSize: 36, fontWeight: '800', marginBottom: 8 },
  splashSub:       { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
});

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Auth
import LoginScreen    from './src/features/auth/screens/LoginScreen';
import RegisterScreen from './src/features/auth/screens/RegisterScreen';

// Marketplace (citizen only)
import MarketplaceScreen   from './src/screens/MarketplaceScreen';
import ListingDetailScreen from './src/screens/ListingDetailScreen';
import CreateListingScreen from './src/screens/CreateListingScreen';
import MyListingsScreen    from './src/screens/MyListingsScreen';
import ProfileScreen       from './src/screens/ProfileScreen';

// Reporting (citizen)
import ReportListScreen   from './src/features/reporting/screens/ReportListScreen';
import ReportDetailScreen from './src/features/reporting/screens/ReportDetailScreen';
import NewReportScreen    from './src/features/reporting/screens/NewReportScreen';
import MyReportsScreen    from './src/features/reporting/screens/MyReportsScreen';
import EditReportScreen   from './src/features/reporting/screens/EditReportScreen';
import ReportMapScreen    from './src/features/reporting/screens/ReportMapScreen';
import CampaignListScreen from './src/features/reporting/screens/CampaignListScreen';
import RewardsScreen      from './src/features/reporting/screens/RewardsScreen';

// Association
import AssociationDashboardScreen from './src/features/association/screens/AssociationDashboardScreen';
import AssociationReportsScreen   from './src/features/association/screens/AssociationReportsScreen';
import AssociationCampaignsScreen from './src/features/association/screens/AssociationCampaignsScreen';
import CreateCampaignScreen       from './src/features/association/screens/CreateCampaignScreen';

// Government
import GovernmentDashboardScreen from './src/features/government/screens/GovernmentDashboardScreen';
import GovernmentReportsScreen   from './src/features/government/screens/GovernmentReportsScreen';
import GovernmentStatsScreen     from './src/features/government/screens/GovernmentStatsScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();
const COLORS = { green:'#2E7D32', white:'#ffffff', border:'#E0E0E0', muted:'#9E9E9E', greenDark:'#1B5E20' };

function TabIcon({ icon, label, focused }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
      <Text style={[styles.iconLabel, focused && styles.iconLabelActive]}>{label}</Text>
    </View>
  );
}

// ── CITIZEN STACKS ─────────────────────────────────────────
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

function CitizenTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false,
      tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.border, borderTopWidth: 1.5, height: Platform.OS === 'ios' ? 80 : 70, paddingBottom: Platform.OS === 'ios' ? 20 : 8 },
    }}>
      <Tab.Screen name="Marketplace" component={MarketplaceScreen}   options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🛒" label="Market"   focused={focused} /> }} />
      <Tab.Screen name="Reports"     component={ReportingStack}       options={{ tabBarIcon: ({ focused }) => <TabIcon icon="♻️"  label="Reports"  focused={focused} /> }} />
      <Tab.Screen name="New Report"  component={NewReportScreen}      options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📍" label="Report"   focused={focused} /> }} />
      <Tab.Screen name="Campaigns"   component={CampaignListScreen}   options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📣" label="Campaigns" focused={focused} /> }} />
      <Tab.Screen name="Sell"        component={CreateListingScreen}  options={{ tabBarIcon: ({ focused }) => <TabIcon icon="➕" label="Sell"      focused={focused} /> }} />
      <Tab.Screen name="Profile"     component={ProfileScreen}        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile"   focused={focused} /> }} />
    </Tab.Navigator>
  );
}

// ── ASSOCIATION STACKS ─────────────────────────────────────
function AssocReportsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AssocReports"  component={AssociationReportsScreen} />
      <Stack.Screen name="ReportDetail"  component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

function AssocCampaignsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AssocCampaigns" component={AssociationCampaignsScreen} />
      <Stack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
    </Stack.Navigator>
  );
}

function AssociationTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false,
      tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.border, borderTopWidth: 1.5, height: Platform.OS === 'ios' ? 80 : 70, paddingBottom: Platform.OS === 'ios' ? 20 : 8 },
    }}>
      <Tab.Screen name="Dashboard" component={AssociationDashboardScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📊" label="Dashboard" focused={focused} /> }} />
      <Tab.Screen name="Reports"   component={AssocReportsStack}          options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🗑️"  label="Reports"   focused={focused} /> }} />
      <Tab.Screen name="Campaigns" component={AssocCampaignsStack}        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📣" label="Campaigns"  focused={focused} /> }} />
      <Tab.Screen name="Profile"   component={ProfileScreen}              options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile"    focused={focused} /> }} />
    </Tab.Navigator>
  );
}

// ── GOVERNMENT STACKS ──────────────────────────────────────
function GovReportsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GovReports"   component={GovernmentReportsScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

function GovernmentTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false,
      tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.border, borderTopWidth: 1.5, height: Platform.OS === 'ios' ? 80 : 70, paddingBottom: Platform.OS === 'ios' ? 20 : 8 },
    }}>
      <Tab.Screen name="Dashboard" component={GovernmentDashboardScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏛️" label="Dashboard" focused={focused} /> }} />
      <Tab.Screen name="Reports"   component={GovReportsStack}           options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🗑️"  label="Reports"   focused={focused} /> }} />
      <Tab.Screen name="Stats"     component={GovernmentStatsScreen}     options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📈" label="Stats"      focused={focused} /> }} />
      <Tab.Screen name="Profile"   component={ProfileScreen}             options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile"    focused={focused} /> }} />
    </Tab.Navigator>
  );
}

// ── ROOT NAVIGATOR ─────────────────────────────────────────
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>♻ EcoReport</Text>
        <Text style={styles.splashSub}>Waste Reporting & Recycling Marketplace</Text>
        <ActivityIndicator size="large" color="#7fffc4" style={{ marginTop: 24 }} />
      </View>
    );
  }

  const getMainTabs = () => {
    const role = user?.role;
    if (role === 'association') return <AssociationTabs />;
    if (role === 'government')  return <GovernmentTabs />;
    return <CitizenTabs />;
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Auth"     component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main"          children={() => getMainTabs()} />
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
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../shared/context/AuthContext';
import colors from '../shared/constants/colors';

// Auth
import LoginScreen    from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';

// Reporting (citizen)
import ReportListScreen   from '../features/reporting/screens/ReportListScreen';
import ReportMapScreen    from '../features/reporting/screens/ReportMapScreen';
import NewReportScreen    from '../features/reporting/screens/NewReportScreen';
import ReportDetailScreen from '../features/reporting/screens/ReportDetailScreen';
import MyReportsScreen    from '../features/reporting/screens/MyReportsScreen';
import EditReportScreen   from '../features/reporting/screens/EditReportScreen';
import CampaignListScreen from '../features/reporting/screens/CampaignListScreen';
import RewardsScreen      from '../features/reporting/screens/RewardsScreen';

// Profile
import ProfileScreen from '../features/profile/screens/ProfileScreen';

// Association screens
import AssociationDashboardScreen from '../features/association/screens/AssociationDashboardScreen';
import AssociationReportsScreen   from '../features/association/screens/AssociationReportsScreen';
import AssociationCampaignsScreen from '../features/association/screens/AssociationCampaignsScreen';
import CreateCampaignScreen       from '../features/association/screens/CreateCampaignScreen';

// Government screens
import GovernmentDashboardScreen from '../features/government/screens/GovernmentDashboardScreen';
import GovernmentReportsScreen   from '../features/government/screens/GovernmentReportsScreen';
import GovernmentStatsScreen     from '../features/government/screens/GovernmentStatsScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const TabIcon = ({ icon, focused }) => (
  <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
);

// ── CITIZEN TABS ──────────────────────────────────────────
const CitizenReportingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ReportList"   component={ReportListScreen} />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    <Stack.Screen name="NewReport"    component={NewReportScreen} />
    <Stack.Screen name="MyReports"    component={MyReportsScreen} />
    <Stack.Screen name="EditReport"   component={EditReportScreen} />
  </Stack.Navigator>
);

const CitizenTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.tabActive, tabBarInactiveTintColor: colors.tabInactive, tabBarStyle: { height: 80, paddingBottom: 20, paddingTop: 8 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
    <Tab.Screen name="Reports"   component={CitizenReportingStack} options={{ tabBarLabel: 'Reports',   tabBarIcon: ({ focused }) => <TabIcon icon="🗑️" focused={focused} /> }} />
    <Tab.Screen name="Map"       component={ReportMapScreen}       options={{ tabBarLabel: 'Map',       tabBarIcon: ({ focused }) => <TabIcon icon="🗺️" focused={focused} /> }} />
    <Tab.Screen name="Campaigns" component={CampaignListScreen}    options={{ tabBarLabel: 'Campaigns', tabBarIcon: ({ focused }) => <TabIcon icon="📣" focused={focused} /> }} />
    <Tab.Screen name="Rewards"   component={RewardsScreen}         options={{ tabBarLabel: 'Rewards',   tabBarIcon: ({ focused }) => <TabIcon icon="⭐" focused={focused} /> }} />
    <Tab.Screen name="Profile"   component={ProfileScreen}         options={{ tabBarLabel: 'Profile',   tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }} />
  </Tab.Navigator>
);

// ── ASSOCIATION TABS ──────────────────────────────────────
const AssociationReportsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AssocReports"  component={AssociationReportsScreen} />
    <Stack.Screen name="ReportDetail"  component={ReportDetailScreen} />
  </Stack.Navigator>
);

const AssociationCampaignsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AssocCampaigns"  component={AssociationCampaignsScreen} />
    <Stack.Screen name="CreateCampaign"  component={CreateCampaignScreen} />
  </Stack.Navigator>
);

const AssociationTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.tabActive, tabBarInactiveTintColor: colors.tabInactive, tabBarStyle: { height: 80, paddingBottom: 20, paddingTop: 8 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
    <Tab.Screen name="Dashboard" component={AssociationDashboardScreen}  options={{ tabBarLabel: 'Dashboard', tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} /> }} />
    <Tab.Screen name="Reports"   component={AssociationReportsStack}     options={{ tabBarLabel: 'Reports',   tabBarIcon: ({ focused }) => <TabIcon icon="🗑️" focused={focused} /> }} />
    <Tab.Screen name="Campaigns" component={AssociationCampaignsStack}   options={{ tabBarLabel: 'Campaigns', tabBarIcon: ({ focused }) => <TabIcon icon="📣" focused={focused} /> }} />
    <Tab.Screen name="Profile"   component={ProfileScreen}               options={{ tabBarLabel: 'Profile',   tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }} />
  </Tab.Navigator>
);

// ── GOVERNMENT TABS ───────────────────────────────────────
const GovernmentReportsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GovReports"   component={GovernmentReportsScreen} />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
  </Stack.Navigator>
);

const GovernmentTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.tabActive, tabBarInactiveTintColor: colors.tabInactive, tabBarStyle: { height: 80, paddingBottom: 20, paddingTop: 8 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
    <Tab.Screen name="Dashboard" component={GovernmentDashboardScreen} options={{ tabBarLabel: 'Dashboard', tabBarIcon: ({ focused }) => <TabIcon icon="🏛️" focused={focused} /> }} />
    <Tab.Screen name="Reports"   component={GovernmentReportsStack}    options={{ tabBarLabel: 'Reports',   tabBarIcon: ({ focused }) => <TabIcon icon="🗑️" focused={focused} /> }} />
    <Tab.Screen name="Stats"     component={GovernmentStatsScreen}     options={{ tabBarLabel: 'Stats',     tabBarIcon: ({ focused }) => <TabIcon icon="📈" focused={focused} /> }} />
    <Tab.Screen name="Profile"   component={ProfileScreen}             options={{ tabBarLabel: 'Profile',   tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }} />
  </Tab.Navigator>
);

// ── AUTH STACK ────────────────────────────────────────────
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login"    component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// ── ROOT ──────────────────────────────────────────────────
const AppNavigator = () => {
  const { token, loading, user } = useAuth();

  if (loading) return null;

  const getMainTabs = () => {
    const role = user?.role;
    if (role === 'association') return <AssociationTabs />;
    if (role === 'government')  return <GovernmentTabs />;
    return <CitizenTabs />;
  };

  return (
    <NavigationContainer>
      {token ? getMainTabs() : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
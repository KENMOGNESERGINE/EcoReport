import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../shared/context/AuthContext';
import colors from '../shared/constants/colors';

// Auth screens
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';

// Citizen screens
import ReportListScreen from '../features/reporting/screens/ReportListScreen';
import ReportMapScreen from '../features/reporting/screens/ReportMapScreen';
import NewReportScreen from '../features/reporting/screens/NewReportScreen';
import ReportDetailScreen from '../features/reporting/screens/ReportDetailScreen';
import MyReportsScreen from '../features/reporting/screens/MyReportsScreen';
import EditReportScreen from '../features/reporting/screens/EditReportScreen';
import RewardsScreen from '../features/reporting/screens/RewardsScreen';
import CampaignListScreen from '../features/reporting/screens/CampaignListScreen';
import CampaignDetailScreen from '../features/reporting/screens/CampaignDetailScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

// Government screens
import GovernmentDashboardScreen from '../features/government/screens/GovernmentDashboardScreen';
import GovernmentReportsScreen from '../features/government/screens/GovernmentReportsScreen';
import GovernmentStatsScreen from '../features/government/screens/GovernmentStatsScreen';
import GovernmentProfileScreen from '../features/government/screens/GovernmentProfileScreen';
// Association screens
import AssociationDashboardScreen from '../features/association/screens/AssociationDashboardScreen';
import AssociationReportsScreen from '../features/association/screens/AssociationReportsScreen';
import AssociationCampaignsScreen from '../features/association/screens/AssociationCampaignsScreen';
import CreateCampaignScreen from '../features/association/screens/CreateCampaignScreen';

// Admin screens
import AdminDashboardScreen from '../features/admin/screens/AdminDashboardScreen';
import AssociationProfileScreen from '../features/association/screens/AssociationProfileScreen';
import AdminUsersScreen from '../features/admin/screens/AdminUsersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, focused }) => (
  <Text style={{
    fontSize: focused ? 24 : 20,
    opacity: focused ? 1 : 0.5
  }}>
    {icon}
  </Text>
);

// ─── CITIZEN NAVIGATION ───
const ReportingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ReportList" component={ReportListScreen} />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    <Stack.Screen name="NewReport" component={NewReportScreen} />
    <Stack.Screen name="MyReports" component={MyReportsScreen} />
    <Stack.Screen name="EditReport" component={EditReportScreen} />
    <Stack.Screen name="Rewards" component={RewardsScreen} />
    <Stack.Screen name="CampaignList" component={CampaignListScreen} />
    <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
  </Stack.Navigator>
);

const CitizenTabs = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 80,
      paddingBottom: 20,
      paddingTop: 8,
    },
    tabBarActiveTintColor: colors.tabActive,
    tabBarInactiveTintColor: colors.tabInactive,
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
  }}>
    <Tab.Screen
      name="Reports"
      component={ReportingStack}
      options={{
        tabBarLabel: 'Reports',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🗑️" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={ReportMapScreen}
      options={{
        tabBarLabel: 'Map',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🗺️" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👤" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ─── GOVERNMENT NAVIGATION ───
const GovernmentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GovReports" component={GovernmentReportsScreen} />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
  </Stack.Navigator>
);

const GovernmentTabs = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 80,
      paddingBottom: 20,
      paddingTop: 8,
    },
    tabBarActiveTintColor: '#1565C0',
    tabBarInactiveTintColor: colors.tabInactive,
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
  }}>
    <Tab.Screen
      name="GovDashboard"
      component={GovernmentDashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🏛️" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="GovReportsTab"
      component={GovernmentStack}
      options={{
        tabBarLabel: 'Reports',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="📋" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="GovStats"
      component={GovernmentStatsScreen}
      options={{
        tabBarLabel: 'Statistics',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="📊" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="GovProfile"
      component={GovernmentProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👤" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ─── ASSOCIATION NAVIGATION ───
const AssociationStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AssocReports" component={AssociationReportsScreen} />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
  </Stack.Navigator>
);

const CampaignsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CampaignsList" component={AssociationCampaignsScreen} />
    <Stack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
  </Stack.Navigator>
);

const AssociationTabs = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 80,
      paddingBottom: 20,
      paddingTop: 8,
    },
    tabBarActiveTintColor: '#2E7D32',
    tabBarInactiveTintColor: colors.tabInactive,
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
  }}>
    <Tab.Screen
      name="AssocDashboard"
      component={AssociationDashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🤝" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AssocReportsTab"
      component={AssociationStack}
      options={{
        tabBarLabel: 'Reports',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="📋" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AssocCampaigns"
      component={CampaignsStack}
      options={{
        tabBarLabel: 'Campaigns',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="📢" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AssocProfile"
      component={AssociationProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👤" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);
  

// ─── ADMIN NAVIGATION ───
const AdminTabs = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 80,
      paddingBottom: 20,
      paddingTop: 8,
    },
    tabBarActiveTintColor: '#B71C1C',
    tabBarInactiveTintColor: colors.tabInactive,
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
  }}>
    <Tab.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👨‍💻" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AdminUsers"
      component={AdminUsersScreen}
      options={{
        tabBarLabel: 'Users',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👥" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AdminProfile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👤" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ─── AUTH NAVIGATION ───
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// ─── MAIN NAVIGATOR ───
const AppNavigator = () => {
  const { token, loading, user } = useAuth();

  if (loading) return null;

  const getTabsByRole = () => {
    switch (user?.role) {
      case 'government': return <GovernmentTabs />;
      case 'association': return <AssociationTabs />;
      case 'admin': return <AdminTabs />;
      default: return <CitizenTabs />;
    }
  };

  return (
    <NavigationContainer>
      {token ? getTabsByRole() : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
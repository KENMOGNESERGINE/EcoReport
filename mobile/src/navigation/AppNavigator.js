import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../shared/context/AuthContext';
import colors from '../shared/constants/colors';

import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import ReportListScreen from '../features/reporting/screens/ReportListScreen';
import ReportMapScreen from '../features/reporting/screens/ReportMapScreen';
import NewReportScreen from '../features/reporting/screens/NewReportScreen';
import ReportDetailScreen from '../features/reporting/screens/ReportDetailScreen';
import MyReportsScreen from '../features/reporting/screens/MyReportsScreen';
import EditReportScreen from '../features/reporting/screens/EditReportScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

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

const ReportingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ReportList" component={ReportListScreen} />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    <Stack.Screen name="NewReport" component={NewReportScreen} />
    <Stack.Screen name="MyReports" component={MyReportsScreen} />
    <Stack.Screen name="EditReport" component={EditReportScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
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
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    }}
  >
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

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      {token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
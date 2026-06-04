import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import AuthScreen          from './src/screens/AuthScreen';
import MarketplaceScreen   from './src/screens/MarketplaceScreen';
import ListingDetailScreen from './src/screens/ListingDetailScreen';
import CreateListingScreen from './src/screens/CreateListingScreen';
import MyListingsScreen    from './src/screens/MyListingsScreen';
import ProfileScreen       from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const COLORS = { green: '#1a7a4a', greenDark: '#0d4a28', muted: '#6b7c72', white: '#ffffff', border: '#d0dbd4', surface: '#f4f7f5' };

function TabIcon({ label, focused }) {
  const icons = { Browse: '🛒', Sell: '➕', 'My Listings': '📋', Profile: '👤' };
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Text style={{ fontSize: 20 }}>{icons[label]}</Text>
      <Text style={[tabStyles.iconLabel, focused && tabStyles.iconLabelActive]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap:  { alignItems: 'center', paddingTop: 4 },
  iconWrapActive: {},
  iconLabel: { fontSize: 10, color: COLORS.muted, marginTop: 2, fontWeight: '600' },
  iconLabelActive: { color: COLORS.green },
});

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1.5,
          height: 70,
          paddingBottom: 8,
        },
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}>
      <Tab.Screen name="Browse"     component={MarketplaceScreen} />
      <Tab.Screen name="Sell"       component={CreateListingScreen} />
      <Tab.Screen name="My Listings" component={MyListingsScreen} />
      <Tab.Screen name="Profile"    component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor: COLORS.greenDark }}>
        <Text style={{ color: '#7fffc4', fontSize: 32, fontWeight: '800', marginBottom: 16 }}>♻ EcoTrade</Text>
        <ActivityIndicator size="large" color="#7fffc4" />
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
          <Stack.Screen name="ListingDetail" component={ListingDetailScreen} options={{ presentation: 'card' }} />
          <Stack.Screen name="CreateListing" component={CreateListingScreen} />
          <Stack.Screen name="MyListings"    component={MyListingsScreen} />
          <Stack.Screen name="Marketplace"   component={MarketplaceScreen} />
          <Stack.Screen name="Profile"       component={ProfileScreen} />
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
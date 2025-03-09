import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0c2340', // Dark navy background to match the reference
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary[500], // Blue accent color
        tabBarInactiveTintColor: '#8E8E93', // Gray inactive color
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="grid-view" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          title: 'Player',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.playerTab}>
              <View style={styles.playerTabInner}>
                <MaterialIcons name="play-arrow" size={24} color="#fff" />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  playerTab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0c2340', // Matching background
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10, // Lift it up a bit
  },
  playerTabInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(38, 116, 226, 0.9)', // Blue similar to the reference
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(38, 116, 226, 0.7)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  }
});
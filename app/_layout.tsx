import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AudioPlayerProvider } from '@/components/player/AudioPlayerProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { usePodcastStore } from '@/stores/podcastStore';

// App colors
export const COLORS = {
  background: '#0c2340', // Dark navy blue background
  primary: '#0066ff',    // Primary blue accent color
  text: '#ffffff',       // White text
  textSecondary: '#8E8E93', // Secondary text
  cardBackground: 'rgba(255, 255, 255, 0.08)', // Card background with transparency
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AudioPlayerProvider>
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: COLORS.background,
              },
              headerTintColor: COLORS.text,
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: COLORS.background,
              },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="podcast/[id]"
              options={{
                title: 'Podcast',
                headerBackTitle: 'Back',
                presentation: 'card',
              }}
            />
          </Stack>
          <PlayerContainer />
        </View>
      </AudioPlayerProvider>
    </GestureHandlerRootView>
  );
}

function PlayerContainer() {
  const { showMiniPlayer } = usePodcastStore();
  
  if (!showMiniPlayer) {
    return null;
  }
  
  return <MiniPlayer />;
}
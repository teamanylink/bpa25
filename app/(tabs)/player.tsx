import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePodcastStore } from '@/stores/podcastStore';

export default function PlayerScreen() {
  const { toggleFullPlayer } = usePodcastStore();
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Player Screen</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => toggleFullPlayer(true)}
      >
        <Text style={styles.buttonText}>Open Full Player</Text>
        <Ionicons name="arrow-up" size={20} color="#fff" style={styles.icon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c2340',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0066ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  icon: {
    marginTop: 2,
  }
});
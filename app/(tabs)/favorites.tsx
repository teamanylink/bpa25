import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { usePodcastStore } from '@/stores/podcastStore';

export default function FavoritesScreen() {
  const { favorites } = usePodcastStore();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Favorites</Text>
      </View>
      
      <View style={styles.content}>
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              You haven't added any favorites yet.
            </Text>
            <Text style={styles.emptySubtext}>
              Tap the heart icon on podcasts to add them here.
            </Text>
          </View>
        ) : (
          <Text style={styles.text}>Favorites Page</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c2340',
  },
  header: {
    padding: 16,
    marginTop: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    textAlign: 'center',
  },
});
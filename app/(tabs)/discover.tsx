import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Discover Page</Text>
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
  },
});
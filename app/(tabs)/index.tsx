import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

// Theme colors
const COLORS = {
  background: '#0c2340',  // Dark navy blue background
  primary: '#0066ff',     // Primary blue accent color
  text: '#ffffff',        // White text
  textSecondary: '#8E8E93', // Secondary text color
  cardBackground: 'rgba(255, 255, 255, 0.08)', // Card background with slight transparency
};

// Mock data for podcasts by category
const MOCK_PODCASTS = [
  { 
    id: '1', 
    title: 'Made by Mammas', 
    author: 'Zoe Hardman & Georgia Dayton',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/25/1c/cf/251ccf71-100c-e913-65a6-454daa697e76/mza_17207433431219273268.jpg/600x600bb.jpg'
  },
  { 
    id: '2', 
    title: 'Huberman Lab', 
    author: 'Dr. Andrew Huberman',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/f6/8c/2b/f68c2b0f-2dab-a28a-bc57-2ecc76831d2c/mza_9990809647659891357.jpg/600x600bb.jpg' 
  },
  { 
    id: '3', 
    title: 'Made by Mammas', 
    author: 'Zoe Hardman & Georgia Dayton',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/25/1c/cf/251ccf71-100c-e913-65a6-454daa697e76/mza_17207433431219273268.jpg/600x600bb.jpg'
  },
];

// Categories
const CATEGORIES = [
  { id: '1', name: 'ALL' },
  { id: '2', name: 'News' },
  { id: '3', name: 'Comedy' },
  { id: '4', name: 'Health' },
];

// Podcast sections to display
const SECTIONS = [
  { id: '1', title: 'Top shows', data: MOCK_PODCASTS },
  { id: '2', title: 'Top Episodes', data: MOCK_PODCASTS },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 3; // 3 items per row with spacing

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState('1'); // Default to 'ALL'
  const [searchText, setSearchText] = useState('');

  // Render a podcast cover item
  const renderPodcastItem = ({ item }) => (
    <Link href={`/podcast/${item.id}`} asChild>
      <TouchableOpacity style={styles.podcastItem}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.podcastImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </Link>
  );

  // Render a category tab
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryTab, 
        activeCategory === item.id && styles.activeCategoryTab
      ]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Text 
        style={[
          styles.categoryText, 
          activeCategory === item.id && styles.activeCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={COLORS.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        {/* Shuffle button */}
        <TouchableOpacity style={styles.shuffleButton}>
          <MaterialIcons name="shuffle" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      {/* Category tabs */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
      />
      
      {/* Main content - podcast sections */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Loop through each section */}
        {SECTIONS.map(section => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <FlatList
              data={section.data}
              renderItem={renderPodcastItem}
              keyExtractor={item => section.id + item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.podcastsContent}
            />
          </View>
        ))}
        
        {/* Ensure enough bottom padding for scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    height: 40,
  },
  shuffleButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesList: {
    maxHeight: 40,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: COLORS.cardBackground,
  },
  activeCategoryTab: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  podcastsContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  podcastItem: {
    width: ITEM_WIDTH,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  podcastImage: {
    width: '100%',
    height: ITEM_WIDTH,
    borderRadius: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
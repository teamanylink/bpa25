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
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Mock data for podcasts
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

// Categories for the top filter
const CATEGORIES = [
  { id: '1', name: 'ALL' },
  { id: '2', name: 'News' },
  { id: '3', name: 'Comedy' },
  { id: '4', name: 'Health' },
];

// Content sections
const SECTIONS = [
  { id: 'featured', title: '', data: MOCK_PODCASTS },
  { id: 'topShows', title: 'Top shows', data: MOCK_PODCASTS },
  { id: 'topEpisodes', title: 'Top Episodes', data: MOCK_PODCASTS },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 3; // 3 items per row with spacing

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState('1'); // Default to 'ALL'
  const [searchText, setSearchText] = useState('');

  // Render a podcast item
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
      
      {/* Search bar and shuffle button */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <TouchableOpacity style={styles.shuffleButton}>
          <MaterialIcons name="shuffle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Categories */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
      />
      
      {/* Main content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section, index) => (
          <View key={section.id} style={[styles.section, index === 0 && styles.topSection]}>
            {section.title ? (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            ) : null}
            
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
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c2340', // Dark navy background from the reference
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly transparent background
    borderRadius: 24, // More rounded corners as shown in the reference
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: 40,
  },
  shuffleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
    backgroundColor: '#1a3353', // Darker category tab background
  },
  activeCategoryTab: {
    backgroundColor: Colors.primary[500], // Blue active tab
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  topSection: {
    marginBottom: 40, // More space after the first section
  },
  sectionTitle: {
    fontSize: 28, // Larger section titles as in reference
    fontWeight: 'bold',
    color: '#fff',
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
    height: 100, // Extra padding at the bottom for scrolling
  },
});
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
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';

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
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/ad/d6/c6/add6c682-2db8-2an7-5e58-5b21b1e8e0a6/mza_7462732051926514009.jpg/600x600bb.jpg' 
  },
  { 
    id: '3', 
    title: 'Made by Mammas', 
    author: 'Zoe Hardman & Georgia Dayton',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/25/1c/cf/251ccf71-100c-e913-65a6-454daa697e76/mza_17207433431219273268.jpg/600x600bb.jpg'
  },
];

// Mock data for categories
const CATEGORIES = [
  { id: '1', name: 'ALL' },
  { id: '2', name: 'News' },
  { id: '3', name: 'Comedy' },
  { id: '4', name: 'Health' },
];

// Sections for podcast grouping
const SECTIONS = [
  { id: '1', title: 'Top shows', data: MOCK_PODCASTS },
  { id: '2', title: 'Top Episodes', data: MOCK_PODCASTS },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 3; // 3 items per row with some padding

export default function BrowsePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeCategory, setActiveCategory] = useState('1');
  const [searchText, setSearchText] = useState('');

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
        
        {/* Add some padding at the bottom for scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c2340', // Dark navy background from screenshot
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
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
    width: 48,
    height: 48,
    borderRadius: 10,
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeCategoryTab: {
    backgroundColor: '#0066ff', // Primary color from theme
  },
  categoryText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#fff',
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
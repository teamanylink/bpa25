import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { usePodcastStore } from '@/stores/podcastStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import GlassCard from '../ui/GlassCard';
import * as Haptics from 'expo-haptics';
import { formatDuration } from '@/utils/formatters';
import { useAudioPlayerContext } from './AudioPlayerProvider';

const { width } = Dimensions.get('window');

export default function MiniPlayer() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { 
    currentEpisode, 
    currentPodcast, 
    toggleMiniPlayer,
    toggleFullPlayer,
  } = usePodcastStore();
  
  const { 
    isLoading, 
    error, 
    isPlaying,
    isSoundReady, 
    isBuffering, 
    position,
    duration,
    togglePlayPause
  } = useAudioPlayerContext();
  
  const translateY = useRef(new Animated.Value(100)).current;
  
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, []);
  
  if (!currentEpisode || !currentPodcast) return null;
  
  // Simplify the handlePlayPause function to be more direct
  const handlePlayPause = () => {
    console.log("MiniPlayer: Play/Pause button pressed, current state:", isPlaying);
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Call the toggle function directly
    togglePlayPause();
  };
  
  const handlePress = () => {
    toggleFullPlayer(true);
  };
  
  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      toggleMiniPlayer(false);
    });
  };
  
  // Format current time and duration
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const currentTimeFormatted = formatTime(position);
  const durationFormatted = formatDuration(duration);
  const progress = duration > 0 ? position / duration : 0;
  
  // Determine status message
  const getStatusMessage = () => {
    if (isLoading) return 'Loading...';
    if (error) return 'Error loading audio';
    if (isBuffering) return 'Buffering...';
    if (!isSoundReady) return 'Preparing...';
    return `${currentTimeFormatted} / ${durationFormatted}`;
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
        isDark && styles.darkContainer
      ]}
    >
      <GlassCard intensity={20} style={styles.card}>
        <Pressable style={styles.content} onPress={handlePress}>
          <Image 
            source={{ uri: currentEpisode.imageUrl || currentPodcast.image }} 
            style={styles.image}
          />
          
          <View style={styles.textContainer}>
            <Text 
              style={[styles.title, isDark && styles.darkText]} 
              numberOfLines={1}
            >
              {currentEpisode.title}
            </Text>
            
            <Text 
              style={[styles.subtitle, isDark && styles.darkTextSecondary]}
              numberOfLines={1}
            >
              {getStatusMessage()}
            </Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handlePlayPause}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              disabled={isLoading || !!error || !isSoundReady}
              activeOpacity={0.7}
            >
              {isLoading || isBuffering ? (
                <ActivityIndicator size="small" color={isDark ? "#FFFFFF" : "#000000"} />
              ) : isPlaying ? (
                <Ionicons name="pause" size={24} color={isDark ? "#FFFFFF" : "#000000"} /> 
              ) : (
                <Ionicons name="play" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.closeButton]}
              onPress={handleClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <AntDesign 
                name="close" 
                size={16} 
                color={isDark ? "#BBBBBB" : "#888888"} 
              />
            </TouchableOpacity>
          </View>
        </Pressable>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progress * 100}%` },
              isDark && styles.darkProgressBar
            ]} 
          />
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 8,
    right: 8,
    zIndex: 100,
  },
  darkContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#E1E1E1',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    marginLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  progressContainer: {
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkTextSecondary: {
    color: '#BBBBBB',
  },
  darkProgressBar: {
    backgroundColor: '#0A84FF',
  },
});
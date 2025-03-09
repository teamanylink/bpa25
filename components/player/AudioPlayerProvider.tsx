import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio, AVPlaybackStatus, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { usePodcastStore } from '@/stores/podcastStore';
import { Platform } from 'react-native';

// Simple interface for the audio player context
export interface AudioPlayerContextType {
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  isSoundReady: boolean;
  isBuffering: boolean;
  position: number;
  duration: number;
  playbackRate: number;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (positionSeconds: number) => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
}

// Create the context with default values
const AudioPlayerContext = createContext<AudioPlayerContextType>({
  isLoading: false,
  error: null,
  isPlaying: false,
  isSoundReady: false,
  isBuffering: false,
  position: 0,
  duration: 0,
  playbackRate: 1.0,
  play: async () => {},
  pause: async () => {},
  togglePlayPause: async () => {},
  seekTo: async () => {},
  setPlaybackRate: async () => {},
});

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sound object reference
  const soundRef = useRef<Audio.Sound | null>(null);
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSoundReady, setIsSoundReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1.0);
  
  // Track initialization attempts
  const initAttemptRef = useRef(0);
  
  // Get podcast store state
  const { 
    currentEpisode
  } = usePodcastStore();

  // Set up audio session once on mount
  useEffect(() => {
    let isMounted = true;
    
    const setupAudio = async () => {
      try {
        console.log('Setting up audio session...');
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log('Audio session set up successfully');
      } catch (error) {
        console.error('Error setting up audio session:', error);
        if (isMounted) {
          setError('Failed to set up audio session');
        }
      }
    };

    setupAudio();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (soundRef.current) {
        console.log('Unloading sound on unmount');
        soundRef.current.unloadAsync().catch(err => 
          console.error('Error unloading sound:', err)
        );
        soundRef.current = null;
      }
    };
  }, []);

  // Playback status update handler
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    // Guard against unmounted component
    if (!soundRef.current) return;
    
    // Log detailed status for debugging
    console.log('Playback status update:', 
      status.isLoaded ? 
        `isPlaying: ${status.isPlaying}, isBuffering: ${status.isBuffering}, position: ${status.positionMillis}ms` : 
        'Sound not loaded'
    );
    
    if (!status.isLoaded) {
      console.log('Status update: Sound not loaded');
      return;
    }
    
    // Update buffering state
    setIsBuffering(status.isBuffering);
    
    // Update position if not seeking
    if (!isSeeking && status.positionMillis !== undefined) {
      setPosition(status.positionMillis / 1000);
    }
    
    // Update duration
    if (status.durationMillis && status.durationMillis > 0) {
      setDuration(status.durationMillis / 1000);
    }
    
    // Update playing state - with a safety check
    if (status.isPlaying !== isPlaying) {
      console.log(`Status reports isPlaying: ${status.isPlaying}, local state: ${isPlaying}`);
      
      // If we're stuck in a situation where we should be playing but aren't,
      // don't update the state which would cause UI to show incorrect state
      if (status.shouldPlay && !status.isPlaying) {
        console.log('Detected shouldPlay=true but isPlaying=false situation, keeping isPlaying state as-is');
      } else {
        setIsPlaying(status.isPlaying);
      }
    }
    
    // Handle playback finishing
    if (status.didJustFinish) {
      console.log('Playback finished');
      setIsPlaying(false);
      setPosition(0);
    }
  };
  
  // Load audio function - simplified and robust
  const loadAudio = async (episodeUrl: string, resetPosition = true) => {
    if (!episodeUrl) {
      console.log('No audio URL provided');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    initAttemptRef.current = 0;
    
    try {
      console.log(`Loading audio from: ${episodeUrl}`);
      
      // Unload any existing sound
      if (soundRef.current) {
        console.log('Unloading previous sound');
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      
      // Create a new sound object with basic options
      const { sound } = await Audio.Sound.createAsync(
        { uri: episodeUrl },
        { 
          shouldPlay: false,
          progressUpdateIntervalMillis: 500,
          positionMillis: resetPosition ? 0 : Math.floor(position * 1000), 
          volume: 1.0,
        },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      
      // Get initial status to check loading
      const status = await sound.getStatusAsync();
      console.log('Initial sound status:', JSON.stringify(status));
      
      if (status.isLoaded) {
        setIsSoundReady(true);
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
        console.log('Audio loaded successfully');
      } else {
        throw new Error('Sound loaded but not ready');
      }
    } catch (err) {
      console.error('Error loading audio:', err);
      setError(`Failed to load audio: ${err instanceof Error ? err.message : String(err)}`);
      setIsSoundReady(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load audio when the episode changes
  useEffect(() => {
    if (!currentEpisode?.audioUrl) return;
    
    console.log('Episode changed, loading audio for:', currentEpisode.title);
    
    // Reset states
    setIsPlaying(false);
    setPosition(0);
    
    // Load the audio
    loadAudio(currentEpisode.audioUrl);
    
    // Clean up function
    return () => {
      if (soundRef.current) {
        console.log('Unloading sound for episode change');
        soundRef.current.unloadAsync().catch(err => 
          console.error('Error unloading sound during cleanup:', err)
        );
        soundRef.current = null;
      }
    };
  }, [currentEpisode?.id, currentEpisode?.audioUrl]);
  
  // Play function
  const play = async () => {
    try {
      console.log('Play function called');
      
      if (!soundRef.current) {
        console.log('Cannot play - no sound loaded');
        
        // If we have an episode URL but no sound, try to recover
        if (currentEpisode?.audioUrl) {
          console.log('Attempting to recover by reloading audio');
          await loadAudio(currentEpisode.audioUrl, false);
          // Short delay before retrying
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          return;
        }
      }
      
      // Even if sound isn't marked as ready, try playing anyway
      // This makes the player more resilient to state issues
      console.log('Attempting to play audio');
      
      // Update UI state immediately for responsiveness
      setIsPlaying(true);
      
      // MULTI-STRATEGY PLAYBACK APPROACH:
      
      // Try all three methods in sequence, return on first success
      await tryPlaybackStrategies();
    } catch (err) {
      console.error('Unexpected error in play function:', err);
      
      // Even if there's an error, don't revert UI state immediately
      // This gives a better UX when audio is playing but the status reporting is delayed
      setTimeout(() => {
        // Only update UI if we're not actually playing after a delay
        if (soundRef.current) {
          soundRef.current.getStatusAsync().then(status => {
            if (!status.isLoaded || !status.isPlaying) {
              setIsPlaying(false);
              setError(`Playback error: ${err instanceof Error ? err.message : String(err)}`);
            }
          }).catch(e => {
            console.log('Error checking playback status:', e);
            setIsPlaying(false);
          });
        } else {
          setIsPlaying(false);
        }
      }, 500);
    }
  };
  
  // Helper function to try different playback strategies in sequence
  const tryPlaybackStrategies = async () => {
    if (!soundRef.current) return false;
    
    // Strategy 1: Standard playAsync
    try {
      console.log('Strategy 1: Attempting standard playAsync');
      const result = await soundRef.current.playAsync();
      console.log('playAsync result:', JSON.stringify(result));
      
      if (result.isLoaded && result.isPlaying) {
        console.log('Playback started successfully with strategy 1');
        return true;
      }
    } catch (err) {
      console.warn('Strategy 1 failed:', err);
    }
    
    // Strategy 2: Set status with shouldPlay: true
    try {
      console.log('Strategy 2: Using setStatusAsync with shouldPlay: true');
      const statusResult = await soundRef.current.setStatusAsync({ shouldPlay: true });
      console.log('setStatusAsync result:', JSON.stringify(statusResult));
      
      if (statusResult.isLoaded && statusResult.isPlaying) {
        console.log('Playback started with strategy 2');
        return true;
      }
    } catch (err) {
      console.warn('Strategy 2 failed:', err);
    }
    
    // Strategy 3: Stop completely and try again
    try {
      console.log('Strategy 3: Stop and play approach');
      await soundRef.current.stopAsync();
      await new Promise(resolve => setTimeout(resolve, 100));
      const finalResult = await soundRef.current.playAsync();
      
      if (finalResult.isLoaded) {
        console.log('Strategy 3 completed');
        return true;
      }
    } catch (err) {
      console.warn('Strategy 3 failed:', err);
    }
    
    console.error('All playback strategies failed');
    return false;
  };
  
  // Pause function - simplified
  const pause = async () => {
    try {
      console.log('Pause function called');
      
      if (!soundRef.current || !isSoundReady) {
        console.log('Cannot pause - sound not ready');
        setIsPlaying(false);
        return;
      }
      
      // Set UI state immediately
      setIsPlaying(false);
      
      console.log('Pausing playback');
      await soundRef.current.pauseAsync();
    } catch (err) {
      console.error('Error pausing audio:', err);
      // Keep UI state as paused even if there's an error
    }
  };
  
  // Toggle play/pause - extremely basic implementation
  const togglePlayPause = async () => {
    console.log('Toggle play/pause called, current state:', isPlaying);
    try {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } catch (err) {
      console.error('Error in togglePlayPause:', err);
    }
  };
  
  // Seek function
  const seekTo = async (positionSeconds: number) => {
    if (!soundRef.current || !isSoundReady) {
      console.log('Cannot seek - sound not ready');
      return;
    }
    
    try {
      console.log(`Seeking to ${positionSeconds} seconds`);
      
      setIsSeeking(true);
      setPosition(positionSeconds);
      
      await soundRef.current.setPositionAsync(Math.floor(positionSeconds * 1000));
      
      // Reset seeking state after a short delay
      setTimeout(() => {
        setIsSeeking(false);
      }, 300);
    } catch (err) {
      console.error('Error seeking:', err);
      setError(`Failed to seek: ${err instanceof Error ? err.message : String(err)}`);
      setIsSeeking(false);
    }
  };
  
  // Set playback rate
  const setPlaybackRate = async (rate: number) => {
    if (!soundRef.current || !isSoundReady) {
      console.log('Cannot set rate - sound not ready');
      return;
    }
    
    try {
      console.log(`Setting playback rate to ${rate}`);
      await soundRef.current.setRateAsync(rate, true);
      setPlaybackRateState(rate);
    } catch (err) {
      console.error('Error setting playback rate:', err);
      setError(`Failed to set playback rate: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Add a "kickstart" effect for audio on iOS
  useEffect(() => {
    let isMounted = true;
    
    const kickstartAudioSystem = async () => {
      try {
        console.log('Attempting to kickstart audio system');
        
        // Instead of loading an external file, create an empty recording in memory
        const sound = new Audio.Sound();
        
        // Just initialize the sound without loading any file
        await sound.setOnPlaybackStatusUpdate(() => {});
        
        // Try to trigger the audio system by manipulating volume
        await sound.setVolumeAsync(0.01);
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Clean up
        await sound.unloadAsync();
        
        console.log('Audio system kickstarted without external files');
      } catch (err) {
        console.warn('Error kickstarting audio system:', err);
      }
    };
    
    // Run kickstart on iOS
    if (Platform.OS === 'ios') {
      kickstartAudioSystem();
    }
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Context value
  const contextValue: AudioPlayerContextType = {
    isLoading,
    error,
    isPlaying,
    isSoundReady,
    isBuffering,
    position,
    duration,
    playbackRate,
    play,
    pause,
    togglePlayPause,
    seekTo,
    setPlaybackRate
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
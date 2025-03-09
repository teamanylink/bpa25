import { create } from 'zustand';
import { Episode, Podcast } from '@/types/podcast';

interface PodcastState {
  // Podcasts
  podcasts: Podcast[];
  setPodcasts: (podcasts: Podcast[]) => void;
  
  // Current podcast
  currentPodcast: Podcast | null;
  setCurrentPodcast: (podcast: Podcast | null) => void;
  
  // Episodes
  episodes: Episode[];
  setEpisodes: (episodes: Episode[]) => void;
  
  // Current episode
  currentEpisode: Episode | null;
  setCurrentEpisode: (episode: Episode | null) => void;
  
  // Favorites
  favorites: string[]; // Array of podcast IDs
  addFavorite: (podcastId: string) => void;
  removeFavorite: (podcastId: string) => void;
  isFavorite: (podcastId: string) => boolean;
  
  // Player control
  showMiniPlayer: boolean;
  showFullPlayer: boolean;
  toggleMiniPlayer: (show?: boolean) => void;
  toggleFullPlayer: (show?: boolean) => void;
}

export const usePodcastStore = create<PodcastState>((set, get) => ({
  // Podcasts
  podcasts: [],
  setPodcasts: (podcasts) => set({ podcasts }),
  
  // Current podcast
  currentPodcast: null,
  setCurrentPodcast: (podcast) => set({ currentPodcast: podcast }),
  
  // Episodes
  episodes: [],
  setEpisodes: (episodes) => set({ episodes }),
  
  // Current episode
  currentEpisode: null,
  setCurrentEpisode: (episode) => {
    set({ 
      currentEpisode: episode,
      // Auto-show mini player when an episode is selected
      showMiniPlayer: episode !== null 
    });
  },
  
  // Favorites
  favorites: [],
  addFavorite: (podcastId) => {
    set((state) => ({
      favorites: [...state.favorites, podcastId]
    }));
  },
  removeFavorite: (podcastId) => {
    set((state) => ({
      favorites: state.favorites.filter(id => id !== podcastId)
    }));
  },
  isFavorite: (podcastId) => {
    return get().favorites.includes(podcastId);
  },
  
  // Player control
  showMiniPlayer: false,
  showFullPlayer: false,
  toggleMiniPlayer: (show) => {
    set((state) => ({
      showMiniPlayer: show !== undefined ? show : !state.showMiniPlayer
    }));
  },
  toggleFullPlayer: (show) => {
    set((state) => ({
      showFullPlayer: show !== undefined ? show : !state.showFullPlayer
    }));
  }
}));
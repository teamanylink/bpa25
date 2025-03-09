export interface Podcast {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  categories: string[];
  website?: string;
  episodeCount?: number;
  lastEpisodeDate?: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  publishDate: string;
  duration: number;
  audioUrl: string;
  imageUrl?: string;
  transcript?: TranscriptSegment[];
}

export interface TranscriptSegment {
  id: string;
  episodeId: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface PodcastQuery {
  search?: string;
  category?: string;
  sort?: 'popularity' | 'recent' | 'alphabetical';
  limit?: number;
  offset?: number;
}

export interface EpisodeQuery {
  podcastId: string;
  limit?: number;
  offset?: number;
}

export interface Brief {
  id: string;
  episodeId: string;
  title: string;
  content: string;
  createdAt: string;
  duration: number; // estimated reading time in seconds
}

export interface UserPodcastData {
  podcastId: string;
  lastListenedEpisodeId?: string;
  lastListenPosition?: number; // In seconds
  isSubscribed: boolean;
}
export type Genre =
  | 'pop'
  | 'rock'
  | 'hip-hop'
  | 'electronic'
  | 'latin'
  | 'r&b'
  | 'indie'
  | 'funk'
  | 'soul';

export interface SongCard {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: Genre | string;
  spotifyTrackId: string;
  imageUrl?: string | null;
}

export type AppRole = 'game' | 'dj';

export interface DeckSeedConfig {
  genres: Genre[];
}

export interface SessionState {
  role: AppRole;
  cdCode: string;
  currentIndex: number;
  revealInGameScreen: boolean;
  deckSeedConfig: DeckSeedConfig;
}

export interface SessionSyncMessage {
  sourceId: string;
  cdCode: string;
  index: number;
  deckSeedConfig: DeckSeedConfig;
  sentAt: number;
}

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
  previewUrl?: string | null;
  imageUrl?: string | null;
  source: 'spotify' | 'mock';
}

export interface Player {
  id: string;
  name: string;
  timeline: SongCard[];
}

export interface GameSettings {
  playerCount: number;
  players: string[];
  genres: Genre[];
  decade?: number;
  winningCards: number;
  spotifyToken?: string;
}

export interface GameState {
  settings: GameSettings;
  players: Player[];
  deck: SongCard[];
  discardPile: SongCard[];
  currentPlayerIndex: number;
  currentSong: SongCard | null;
  currentPlacement: number;
  roundResult?: {
    correct: boolean;
    insertedYear: number;
    song: SongCard;
    playerName: string;
  };
  winnerId?: string;
  finished: boolean;
}

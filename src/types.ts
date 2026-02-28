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

export interface Player {
  id: string;
  name: string;
  timeline: SongCard[];
}

export interface GameSettings {
  playerCount: number;
  players: string[];
  genres: Genre[];
  winningCards: number;
}

export type TurnPhase = 'listen' | 'place' | 'result';

export interface GameState {
  settings: GameSettings;
  players: Player[];
  deck: SongCard[];
  discardPile: SongCard[];
  currentPlayerIndex: number;
  currentSong: SongCard | null;
  currentPlacement: number;
  turnPhase: TurnPhase;
  roundResult?: {
    correct: boolean;
    insertedYear: number;
    song: SongCard;
    playerName: string;
  };
  winnerId?: string;
  finished: boolean;
}

import { mockSongs } from '../data/mockSongs';
import type { DeckSeedConfig, Genre, SongCard } from '../types';
import { seededShuffle } from '../utils/seededRng';

export function getAvailableGenres(): Genre[] {
  return Array.from(new Set(mockSongs.map((song) => song.genre as Genre))).sort();
}

export function normalizeCdCode(raw: string): string {
  const cleaned = raw.replace(/\D/g, '').slice(0, 6);
  return cleaned.padStart(6, '0');
}

export function generateCdCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function getDeckFromSeed(cdCode: string, config: DeckSeedConfig): SongCard[] {
  const genres = config.genres.length > 0 ? config.genres : getAvailableGenres();
  const filtered = mockSongs.filter((song) => genres.includes(song.genre as Genre));
  const source = filtered.length >= 12 ? filtered : mockSongs;
  const stableSeed = `${normalizeCdCode(cdCode)}|${genres.slice().sort().join(',')}`;
  return seededShuffle(source, stableSeed);
}

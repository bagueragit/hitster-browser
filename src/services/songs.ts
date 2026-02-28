import { mockSongs } from '../data/mockSongs';
import type { Genre, SongCard } from '../types';
import { shuffle } from '../utils/helpers';

export function getAvailableGenres(): Genre[] {
  return Array.from(new Set(mockSongs.map((song) => song.genre as Genre))).sort();
}

export async function loadSongs(input: { genres: Genre[] }): Promise<{ songs: SongCard[] }> {
  const { genres } = input;
  const filtered = mockSongs.filter((song) => genres.includes(song.genre as Genre));
  const songs = filtered.length >= 12 ? filtered : mockSongs;

  return { songs: shuffle(songs) };
}

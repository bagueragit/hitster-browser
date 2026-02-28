import { mockSongs } from '../data/mockSongs';
import type { Genre, SongCard } from '../types';
import { decadeRange, shuffle } from '../utils/helpers';

const SPOTIFY_API = 'https://api.spotify.com/v1/search';

function mapSpotifyTrack(track: any, genreFallback: string): SongCard | null {
  const releaseDate = track?.album?.release_date as string | undefined;
  const year = releaseDate ? Number.parseInt(releaseDate.slice(0, 4), 10) : NaN;
  if (!year || Number.isNaN(year)) return null;

  return {
    id: track.id,
    title: track.name,
    artist: Array.isArray(track.artists) ? track.artists.map((a: any) => a.name).join(', ') : 'Unknown',
    year,
    genre: genreFallback,
    previewUrl: track.preview_url,
    imageUrl: track.album?.images?.[1]?.url ?? track.album?.images?.[0]?.url ?? null,
    source: 'spotify',
  };
}

async function fetchSpotifyByGenre(token: string, genres: Genre[], decade?: number): Promise<SongCard[]> {
  const range = decadeRange(decade);
  const all: SongCard[] = [];

  for (const genre of genres) {
    const query = range
      ? `genre:${genre} year:${range[0]}-${range[1]}`
      : `genre:${genre}`;

    const url = new URL(SPOTIFY_API);
    url.searchParams.set('q', query);
    url.searchParams.set('type', 'track');
    url.searchParams.set('limit', '20');
    url.searchParams.set('market', 'US');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify request failed (${response.status})`);
    }

    const data = await response.json();
    const tracks = data?.tracks?.items ?? [];
    const mapped = tracks
      .map((track: any) => mapSpotifyTrack(track, genre))
      .filter(Boolean) as SongCard[];

    all.push(...mapped);
  }

  const unique = new Map<string, SongCard>();
  all.forEach((song) => unique.set(song.id, song));
  return shuffle(Array.from(unique.values()));
}

function getMockSongs(genres: Genre[], decade?: number): SongCard[] {
  const range = decadeRange(decade);
  const filtered = mockSongs.filter((song) => {
    const genreOk = genres.includes(song.genre as Genre);
    const decadeOk = !range || (song.year >= range[0] && song.year <= range[1]);
    return genreOk && decadeOk;
  });

  if (filtered.length >= 12) return shuffle(filtered);
  return shuffle(mockSongs.filter((song) => genres.includes(song.genre as Genre)));
}

export async function loadSongs(input: {
  genres: Genre[];
  decade?: number;
  spotifyToken?: string;
}): Promise<{ songs: SongCard[]; source: 'spotify' | 'mock' }> {
  const { genres, decade, spotifyToken } = input;

  if (spotifyToken?.trim()) {
    try {
      const spotifySongs = await fetchSpotifyByGenre(spotifyToken.trim(), genres, decade);
      if (spotifySongs.length >= 12) {
        return { songs: spotifySongs, source: 'spotify' };
      }
    } catch {
      // fallback below
    }
  }

  return { songs: getMockSongs(genres, decade), source: 'mock' };
}

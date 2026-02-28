import type { GameState } from '../types';

const STORAGE_KEY = 'hitster-browser-game';
const TOKEN_KEY = 'hitster-browser-spotify-token';

export function saveGame(game: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function clearGame(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveSpotifyToken(token: string): void {
  if (!token.trim()) return;
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function loadSpotifyToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? '';
}

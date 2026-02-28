import type { SongCard } from '../types';

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function isPlacementCorrect(timeline: SongCard[], placement: number, year: number): boolean {
  const left = placement > 0 ? timeline[placement - 1] : undefined;
  const right = placement < timeline.length ? timeline[placement] : undefined;

  if (left && year < left.year) return false;
  if (right && year > right.year) return false;
  return true;
}

export function insertAtPlacement(timeline: SongCard[], placement: number, card: SongCard): SongCard[] {
  const next = [...timeline];
  next.splice(placement, 0, card);
  return next;
}

export function decadeRange(decade?: number): [number, number] | null {
  if (!decade) return null;
  return [decade, decade + 9];
}

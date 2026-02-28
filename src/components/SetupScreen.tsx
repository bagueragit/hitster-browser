import { type FormEvent, useMemo, useState } from 'react';
import type { GameSettings, Genre } from '../types';
import { loadSpotifyToken } from '../utils/storage';

const GENRES: Genre[] = ['pop', 'rock', 'hip-hop', 'electronic', 'latin', 'r&b', 'indie', 'funk', 'soul'];
const DECADES = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

interface SetupScreenProps {
  onStart: (settings: GameSettings) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<string[]>(['Jogador 1', 'Jogador 2']);
  const [genres, setGenres] = useState<Genre[]>(['pop', 'rock']);
  const [decade, setDecade] = useState<number | undefined>(undefined);
  const [winningCards, setWinningCards] = useState(10);
  const [spotifyToken, setSpotifyToken] = useState(loadSpotifyToken());

  const canStart = useMemo(() => {
    return players.slice(0, playerCount).every((name) => name.trim().length > 0) && genres.length > 0;
  }, [playerCount, players, genres]);

  const updatePlayerCount = (nextCount: number) => {
    setPlayerCount(nextCount);
    setPlayers((prev) => {
      const next = [...prev];
      while (next.length < nextCount) {
        next.push(`Jogador ${next.length + 1}`);
      }
      return next.slice(0, nextCount);
    });
  };

  const toggleGenre = (genre: Genre) => {
    setGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canStart) return;

    onStart({
      playerCount,
      players: players.slice(0, playerCount),
      genres,
      decade,
      winningCards,
      spotifyToken: spotifyToken.trim() || undefined,
    });
  };

  return (
    <div className="screen-card">
      <h1>Hitster Browser (MVP)</h1>
      <p>Pass-and-play local com timeline musical. Escolha as opções e comece.</p>

      <form onSubmit={onSubmit} className="setup-form">
        <label>
          Número de jogadores: <strong>{playerCount}</strong>
          <input
            type="range"
            min={2}
            max={8}
            value={playerCount}
            onChange={(e) => updatePlayerCount(Number(e.target.value))}
          />
        </label>

        <div>
          <h3>Nome dos jogadores</h3>
          <div className="player-grid">
            {players.slice(0, playerCount).map((name, idx) => (
              <input
                key={idx}
                value={name}
                onChange={(e) =>
                  setPlayers((prev) => {
                    const next = [...prev];
                    next[idx] = e.target.value;
                    return next;
                  })
                }
                placeholder={`Jogador ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div>
          <h3>Gêneros musicais</h3>
          <div className="genre-grid">
            {GENRES.map((genre) => (
              <button
                type="button"
                key={genre}
                className={genres.includes(genre) ? 'chip chip-active' : 'chip'}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <label>
          Década (opcional)
          <select value={decade ?? ''} onChange={(e) => setDecade(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">Qualquer</option>
            {DECADES.map((d) => (
              <option key={d} value={d}>
                {d}s
              </option>
            ))}
          </select>
        </label>

        <label>
          Cartas para vencer
          <input
            type="number"
            min={3}
            max={20}
            value={winningCards}
            onChange={(e) => setWinningCards(Number(e.target.value) || 10)}
          />
        </label>

        <label>
          Spotify token (opcional)
          <input
            value={spotifyToken}
            onChange={(e) => setSpotifyToken(e.target.value)}
            placeholder="Bearer token para Spotify Web API"
          />
        </label>

        <button disabled={!canStart} className="primary-btn" type="submit">
          Iniciar partida
        </button>
      </form>
    </div>
  );
}

import { type FormEvent, useMemo, useState } from 'react';
import { getAvailableGenres } from '../services/songs';
import type { GameSettings, Genre } from '../types';

interface SetupScreenProps {
  onStart: (settings: GameSettings) => void;
}

const deckGenres = getAvailableGenres();

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<string[]>(['Jogador 1', 'Jogador 2']);
  const [winningCards, setWinningCards] = useState(8);
  const [genres, setGenres] = useState<Genre[]>(deckGenres);

  const canStart = useMemo(() => {
    return players.slice(0, playerCount).every((name) => name.trim().length > 0) && genres.length > 0;
  }, [playerCount, players, genres]);

  const updatePlayerCount = (nextCount: number) => {
    setPlayerCount(nextCount);
    setPlayers((prev) => {
      const next = [...prev];
      while (next.length < nextCount) next.push(`Jogador ${next.length + 1}`);
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
      winningCards,
    });
  };

  return (
    <section className="screen-card glass setup-card">
      <h1>Hitster Browser</h1>
      <p className="muted">Passe o celular, abra no Spotify e encaixe na timeline.</p>

      <form onSubmit={onSubmit} className="setup-form">
        <label>
          Jogadores: <strong>{playerCount}</strong>
          <input type="range" min={2} max={8} value={playerCount} onChange={(e) => updatePlayerCount(Number(e.target.value))} />
        </label>

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

        <label>
          Meta de vitória
          <input
            type="number"
            min={4}
            max={20}
            value={winningCards}
            onChange={(e) => setWinningCards(Number(e.target.value) || 8)}
          />
        </label>

        <div>
          <small className="muted">Gêneros do baralho</small>
          <div className="genre-grid">
            {deckGenres.map((genre) => (
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

        <button disabled={!canStart} className="primary-btn" type="submit">
          Começar
        </button>
      </form>
    </section>
  );
}

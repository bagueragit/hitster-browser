import { type FormEvent, useMemo, useState } from 'react';
import { generateCdCode, getAvailableGenres, normalizeCdCode } from '../services/songs';
import type { AppRole, Genre, SessionState } from '../types';

interface SetupScreenProps {
  onStart: (session: SessionState) => void;
}

const deckGenres = getAvailableGenres();

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [role, setRole] = useState<AppRole>('game');
  const [cdCode, setCdCode] = useState(generateCdCode());
  const [genres, setGenres] = useState<Genre[]>(deckGenres);
  const [playerCount, setPlayerCount] = useState(2);

  const canStart = useMemo(() => cdCode.trim().length > 0 && genres.length > 0 && playerCount >= 2, [cdCode, genres, playerCount]);

  const toggleGenre = (genre: Genre) => {
    setGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canStart) return;

    onStart({
      role,
      cdCode: normalizeCdCode(cdCode),
      currentIndex: 0,
      currentPlayer: 1,
      playerCount,
      revealInGameScreen: false,
      deckSeedConfig: {
        genres: genres.slice().sort(),
      },
    });
  };

  return (
    <section className="screen-card glass setup-card">
      <h1>Hitster Local</h1>
      <p className="muted">Escolha o aparelho e comece a partida.</p>

      <form onSubmit={onSubmit} className="setup-form">
        <div className="role-grid">
          <button type="button" className={role === 'game' ? 'chip chip-active' : 'chip'} onClick={() => setRole('game')}>
            Jogadores (tablet)
          </button>
          <button type="button" className={role === 'dj' ? 'chip chip-active' : 'chip'} onClick={() => setRole('dj')}>
            DJ (celular)
          </button>
        </div>

        <label>
          Código da partida
          <div className="cd-row">
            <input
              value={cdCode}
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => setCdCode(normalizeCdCode(e.target.value))}
              placeholder="123456"
            />
            <button type="button" className="ghost-btn" onClick={() => setCdCode(generateCdCode())}>
              Gerar
            </button>
          </div>
        </label>

        <label>
          Jogadores
          <input
            type="number"
            min={2}
            max={8}
            value={playerCount}
            onChange={(e) => setPlayerCount(Math.max(2, Math.min(8, Number(e.target.value) || 2)))}
          />
        </label>

        <div>
          <small className="muted">Escolha os gêneros</small>
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

        <div className="hint-box muted">Use o mesmo código e os mesmos gêneros nos dois aparelhos.</div>

        <button disabled={!canStart} className="primary-btn" type="submit">
          Entrar na sessão
        </button>
      </form>
    </section>
  );
}

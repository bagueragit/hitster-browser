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

  const canStart = useMemo(() => cdCode.trim().length > 0 && genres.length > 0, [cdCode, genres]);

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
      revealInGameScreen: false,
      deckSeedConfig: {
        genres: genres.slice().sort(),
      },
    });
  };

  return (
    <section className="screen-card glass setup-card">
      <h1>Hitster Browser</h1>
      <p className="muted">2 aparelhos sem backend: escolha o papel, compartilhe o código CD e jogue.</p>

      <form onSubmit={onSubmit} className="setup-form">
        <div className="role-grid">
          <button type="button" className={role === 'game' ? 'chip chip-active' : 'chip'} onClick={() => setRole('game')}>
            Tela do Jogo (tablet)
          </button>
          <button type="button" className={role === 'dj' ? 'chip chip-active' : 'chip'} onClick={() => setRole('dj')}>
            Controle DJ (celular)
          </button>
        </div>

        <label>
          Código CD (6 dígitos)
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

        <div>
          <small className="muted">Gêneros do baralho (precisam ser iguais nos 2 aparelhos)</small>
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

        <div className="hint-box muted">
          Mesmo navegador/dispositivo: sincroniza em tempo real via BroadcastChannel/localStorage. <br />
          Dispositivos diferentes: use o mesmo CD + gêneros e alinhe manualmente o índice da faixa.
        </div>

        <button disabled={!canStart} className="primary-btn" type="submit">
          Entrar na sessão
        </button>
      </form>
    </section>
  );
}

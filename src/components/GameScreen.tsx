import { useEffect, useState } from 'react';
import type { SessionState, SongCard } from '../types';

interface GameScreenProps {
  session: SessionState;
  song: SongCard;
  totalTracks: number;
  onChangeIndex: (index: number, rotatePlayer?: boolean) => void;
  onToggleReveal: () => void;
  onRestart: () => void;
}

function spotifyLinks(trackId: string) {
  return {
    app: `spotify://track/${trackId}`,
    web: `https://open.spotify.com/track/${trackId}`,
  };
}

export function GameScreen({ session, song, totalTracks, onChangeIndex, onToggleReveal, onRestart }: GameScreenProps) {
  const isDj = session.role === 'dj';
  const links = spotifyLinks(song.spotifyTrackId);
  const [manualIndex, setManualIndex] = useState(String(session.currentIndex + 1));
  const [guessedYear, setGuessedYear] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setManualIndex(String(session.currentIndex + 1));
    setGuessedYear('');
    setChecked(false);
  }, [session.currentIndex]);

  const applyManualIndex = () => {
    const parsed = Number(manualIndex);
    if (Number.isNaN(parsed)) return;
    const zeroBased = Math.max(0, Math.min(totalTracks - 1, parsed - 1));
    onChangeIndex(zeroBased);
  };

  const checkYear = () => {
    const year = Number(guessedYear);
    if (!year) return;
    setChecked(true);
    if (!session.revealInGameScreen) onToggleReveal();
  };

  const guessedCorrectly = Number(guessedYear) === song.year;

  return (
    <section className="screen-card glass game-card">
      <div className="top-row">
        <h2>{isDj ? 'DJ' : 'Jogo'}</h2>
        <span className="muted">Código {session.cdCode}</span>
      </div>

      <div className="score-chip active">
        Jogador <strong>{session.currentPlayer}</strong>/{session.playerCount} · Faixa <strong>{session.currentIndex + 1}</strong>/{totalTracks}
      </div>

      {isDj ? (
        <div className="secret-panel reveal-enter">
          <h3>{song.title}</h3>
          <p className="muted">
            {song.artist} · {song.year}
          </p>
          <a className="primary-btn link-btn" href={links.app}>
            Abrir no Spotify
          </a>
          <a className="ghost-btn link-btn" href={links.web} target="_blank" rel="noreferrer">
            Abrir no navegador
          </a>
        </div>
      ) : (
        <div className="secret-panel reveal-enter">
          <h3>Qual é o ano da música?</h3>
          <div className="cd-row">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Ex: 1998"
              value={guessedYear}
              onChange={(e) => setGuessedYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
            <button className="secondary-btn" onClick={checkYear} disabled={guessedYear.length < 4}>
              Confirmar ano
            </button>
          </div>

          {session.revealInGameScreen && (
            <div className={`result-box ${checked && guessedCorrectly ? 'success' : 'error'}`}>
              <strong>{song.title}</strong>
              <p>
                {song.artist} · {song.year}
              </p>
              {checked && <p>{guessedCorrectly ? 'Acertou o ano' : `Seu palpite: ${guessedYear}`}</p>}
            </div>
          )}
        </div>
      )}

      {isDj ? (
        <>
          <div className="control-grid">
            <button className="ghost-btn" onClick={() => onChangeIndex(Math.max(0, session.currentIndex - 1))}>
              ← Anterior
            </button>
            <button className="primary-btn" onClick={() => onChangeIndex(Math.min(totalTracks - 1, session.currentIndex + 1), true)}>
              Próxima →
            </button>
          </div>

          <div className="cd-row">
            <input value={manualIndex} onChange={(e) => setManualIndex(e.target.value.replace(/\D/g, ''))} />
            <button className="secondary-btn" onClick={applyManualIndex}>
              Ir para faixa
            </button>
          </div>
        </>
      ) : (
        <div className="control-grid">
          <button className="ghost-btn" onClick={onToggleReveal}>
            {session.revealInGameScreen ? 'Ocultar resposta' : 'Revelar resposta'}
          </button>
          <button className="primary-btn" onClick={() => onChangeIndex(Math.min(totalTracks - 1, session.currentIndex + 1), true)}>
            Próxima rodada
          </button>
        </div>
      )}

      <button className="ghost-btn" onClick={onRestart}>
        Sair da sessão
      </button>
    </section>
  );
}

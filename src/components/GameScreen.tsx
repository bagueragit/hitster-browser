import { useEffect, useState } from 'react';
import type { SessionState, SongCard } from '../types';

interface GameScreenProps {
  session: SessionState;
  song: SongCard;
  totalTracks: number;
  onChangeIndex: (index: number) => void;
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

  useEffect(() => {
    setManualIndex(String(session.currentIndex + 1));
  }, [session.currentIndex]);

  const applyManualIndex = () => {
    const parsed = Number(manualIndex);
    if (Number.isNaN(parsed)) return;
    const zeroBased = Math.max(0, Math.min(totalTracks - 1, parsed - 1));
    onChangeIndex(zeroBased);
  };

  return (
    <section className="screen-card glass game-card">
      <div className="top-row">
        <h2>{isDj ? 'Controle DJ' : 'Tela do Jogo'}</h2>
        <span className="muted">CD {session.cdCode}</span>
      </div>

      <div className="score-chip active">
        Faixa <strong>{session.currentIndex + 1}</strong>/{totalTracks}
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
            fallback web
          </a>
        </div>
      ) : (
        <div className="secret-panel reveal-enter">
          <h3>Carta da rodada</h3>
          <p className="muted">No modo Jogo os metadados ficam ocultos até reveal.</p>
          <button className="secondary-btn" onClick={onToggleReveal}>
            {session.revealInGameScreen ? 'Ocultar metadados' : 'Revelar metadados'}
          </button>
          {session.revealInGameScreen && (
            <div className="result-box success">
              <strong>{song.title}</strong>
              <p>
                {song.artist} · {song.year}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="control-grid">
        <button className="ghost-btn" onClick={() => onChangeIndex(Math.max(0, session.currentIndex - 1))}>
          ← Anterior
        </button>
        <button className="primary-btn" onClick={() => onChangeIndex(Math.min(totalTracks - 1, session.currentIndex + 1))}>
          Próxima →
        </button>
      </div>

      <div className="cd-row">
        <input value={manualIndex} onChange={(e) => setManualIndex(e.target.value.replace(/\D/g, ''))} />
        <button className="secondary-btn" onClick={applyManualIndex}>
          Sincronizar índice
        </button>
      </div>

      <p className="muted tiny">
        Sem backend: em aparelhos diferentes o avanço é manual. Use a mesma faixa exibida para alinhar.
      </p>

      <button className="ghost-btn" onClick={onRestart}>
        Sair da sessão
      </button>
    </section>
  );
}

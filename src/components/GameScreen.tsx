import type { GameState, Player } from '../types';

interface GameScreenProps {
  game: GameState;
  onSelectPlacement: (placement: number) => void;
  onConfirmMove: () => void;
  onNextTurn: () => void;
  onRestart: () => void;
  onMoveToPlacement: () => void;
}

function spotifyLinks(trackId: string) {
  return {
    app: `spotify://track/${trackId}`,
    web: `https://open.spotify.com/track/${trackId}`,
  };
}

function Timeline({
  player,
  selectedPlacement,
  onSelectPlacement,
}: {
  player: Player;
  selectedPlacement: number;
  onSelectPlacement: (placement: number) => void;
}) {
  return (
    <div className="timeline-wrap">
      {player.timeline.map((song, index) => (
        <div key={song.id} className="timeline-block">
          <button
            className={selectedPlacement === index ? 'slot slot-active' : 'slot'}
            onClick={() => onSelectPlacement(index)}
            type="button"
          >
            +
          </button>
          <div className="timeline-card">
            <small>{song.year}</small>
            <div>{song.title}</div>
          </div>
        </div>
      ))}
      <button
        className={selectedPlacement === player.timeline.length ? 'slot slot-active' : 'slot'}
        onClick={() => onSelectPlacement(player.timeline.length)}
        type="button"
      >
        +
      </button>
    </div>
  );
}

export function GameScreen({ game, onSelectPlacement, onConfirmMove, onNextTurn, onRestart, onMoveToPlacement }: GameScreenProps) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const song = game.currentSong;

  if (game.finished) {
    const winner = game.players.find((p) => p.id === game.winnerId);
    return (
      <section className="screen-card glass">
        <h1>Fim de jogo</h1>
        <p>{winner ? `🏆 ${winner.name} venceu!` : 'Baralho encerrado.'}</p>
        <button className="primary-btn" onClick={onRestart}>Nova partida</button>
      </section>
    );
  }

  if (!song) {
    return null;
  }

  const links = spotifyLinks(song.spotifyTrackId);

  return (
    <section className="screen-card glass game-card">
      <div className="top-row">
        <h2>{currentPlayer.name}</h2>
        <span className="muted">Restantes: {game.deck.length}</span>
      </div>

      <div className="score-list">
        {game.players.map((player) => (
          <div key={player.id} className={player.id === currentPlayer.id ? 'score-chip active' : 'score-chip'}>
            {player.name} <strong>{player.timeline.length}</strong>/{game.settings.winningCards}
          </div>
        ))}
      </div>

      {game.turnPhase === 'listen' && (
        <div className="secret-panel reveal-enter">
          <h3>Carta oculta</h3>
          <p className="muted">Abra no Spotify e passe o celular sem revelar.</p>
          <a className="primary-btn link-btn" href={links.app}>
            Abrir no Spotify
          </a>
          <a className="ghost-btn link-btn" href={links.web} target="_blank" rel="noreferrer">
            fallback web
          </a>
          <button className="secondary-btn" onClick={onMoveToPlacement}>
            Já ouviu · posicionar
          </button>
        </div>
      )}

      {game.turnPhase === 'place' && (
        <div className="secret-panel reveal-enter">
          <h3>Posicione a carta</h3>
          <p className="muted">Metadados continuam ocultos até confirmar.</p>
          <Timeline player={currentPlayer} selectedPlacement={game.currentPlacement} onSelectPlacement={onSelectPlacement} />
          <button className="primary-btn" onClick={onConfirmMove}>Confirmar posição</button>
        </div>
      )}

      {game.roundResult && game.turnPhase === 'result' && (
        <div className={game.roundResult.correct ? 'result-box success reveal-enter' : 'result-box error reveal-enter'}>
          <strong>{game.roundResult.correct ? 'Acertou ✅' : 'Errou ❌'}</strong>
          <p>
            {game.roundResult.song.title} · {game.roundResult.song.artist}
          </p>
          <p>Ano: {game.roundResult.song.year}</p>
          <button className="primary-btn" onClick={onNextTurn}>Próxima rodada</button>
        </div>
      )}

      <button className="ghost-btn" onClick={onRestart}>Encerrar</button>
    </section>
  );
}

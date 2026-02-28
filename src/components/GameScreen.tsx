import type { GameState, Player } from '../types';

interface GameScreenProps {
  game: GameState;
  onSelectPlacement: (placement: number) => void;
  onConfirmMove: () => void;
  onNextTurn: () => void;
  onRestart: () => void;
}

function Timeline({ player, selectedPlacement, onSelectPlacement }: {
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
            Inserir aqui
          </button>
          <div className="timeline-card">
            <small>{song.year}</small>
            <div>{song.title}</div>
            <small>{song.artist}</small>
          </div>
        </div>
      ))}
      <button
        className={selectedPlacement === player.timeline.length ? 'slot slot-active' : 'slot'}
        onClick={() => onSelectPlacement(player.timeline.length)}
        type="button"
      >
        Inserir no fim
      </button>
    </div>
  );
}

export function GameScreen({ game, onSelectPlacement, onConfirmMove, onNextTurn, onRestart }: GameScreenProps) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const song = game.currentSong;

  if (game.finished) {
    const winner = game.players.find((p) => p.id === game.winnerId);
    return (
      <div className="screen-card">
        <h1>Fim de jogo</h1>
        <p>
          {winner ? `🏆 ${winner.name} venceu com ${winner.timeline.length} cartas corretas!` : 'Sem vencedor (baralho acabou).'}
        </p>
        <button className="primary-btn" onClick={onRestart}>Nova partida</button>
      </div>
    );
  }

  return (
    <div className="screen-card">
      <div className="top-row">
        <h2>Vez de: {currentPlayer.name}</h2>
        <span>
          Rodadas restantes: {game.deck.length}
        </span>
      </div>

      <div className="score-list">
        {game.players.map((player) => (
          <div key={player.id} className={player.id === currentPlayer.id ? 'score-chip active' : 'score-chip'}>
            {player.name}: {player.timeline.length}/{game.settings.winningCards}
          </div>
        ))}
      </div>

      {song && (
        <div className="song-card">
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
          {song.imageUrl && <img src={song.imageUrl} alt={song.title} className="cover" />}
          {song.previewUrl ? (
            <audio controls src={song.previewUrl} />
          ) : (
            <small>Sem preview de 30s disponível para esta faixa.</small>
          )}
          <small>Fonte: {song.source === 'spotify' ? 'Spotify' : 'Mock local'}</small>
        </div>
      )}

      <div>
        <h3>Timeline de {currentPlayer.name}</h3>
        <Timeline player={currentPlayer} selectedPlacement={game.currentPlacement} onSelectPlacement={onSelectPlacement} />
      </div>

      {!game.roundResult ? (
        <button className="primary-btn" onClick={onConfirmMove}>Confirmar posição</button>
      ) : (
        <div className={game.roundResult.correct ? 'result-box success' : 'result-box error'}>
          <strong>{game.roundResult.correct ? 'Acertou! ✅' : 'Errou! ❌'}</strong>
          <p>
            {game.roundResult.song.title} foi lançada em {game.roundResult.song.year}.
          </p>
          <button className="primary-btn" onClick={onNextTurn}>Próxima rodada</button>
        </div>
      )}

      <button className="ghost-btn" onClick={onRestart}>Encerrar e voltar ao início</button>
    </div>
  );
}

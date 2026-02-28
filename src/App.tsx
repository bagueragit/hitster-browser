import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { GameScreen } from './components/GameScreen';
import { SetupScreen } from './components/SetupScreen';
import { loadSongs } from './services/songs';
import type { GameSettings, GameState, Player, SongCard } from './types';
import { insertAtPlacement, isPlacementCorrect, shuffle } from './utils/helpers';
import { clearGame, loadGame, saveGame } from './utils/storage';

function createPlayer(name: string, index: number): Player {
  return {
    id: `p-${index}-${crypto.randomUUID()}`,
    name,
    timeline: [],
  };
}

function createInitialGame(settings: GameSettings, songs: SongCard[]): GameState {
  const deck = shuffle(songs);
  const players = settings.players.map((name, idx) => createPlayer(name, idx));

  players.forEach((player) => {
    const card = deck.shift();
    if (card) player.timeline = [card];
  });

  return {
    settings,
    players,
    deck,
    discardPile: [],
    currentPlayerIndex: 0,
    currentSong: deck.shift() ?? null,
    currentPlacement: 0,
    turnPhase: 'listen',
    finished: false,
  };
}

function App() {
  const [game, setGame] = useState<GameState | null>(() => loadGame());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (game) saveGame(game);
  }, [game]);

  const currentPlayer = useMemo(() => (game ? game.players[game.currentPlayerIndex] : null), [game]);

  const handleStart = async (settings: GameSettings) => {
    setLoading(true);
    const { songs } = await loadSongs({ genres: settings.genres });
    const initialGame = createInitialGame(settings, songs);
    setGame(initialGame);
    setLoading(false);
  };

  const handleConfirmMove = () => {
    if (!game || !game.currentSong || !currentPlayer) return;

    const placement = game.currentPlacement;
    const correct = isPlacementCorrect(currentPlayer.timeline, placement, game.currentSong.year);

    const players = [...game.players];
    const player = { ...players[game.currentPlayerIndex] };
    players[game.currentPlayerIndex] = player;

    if (correct) {
      player.timeline = insertAtPlacement(player.timeline, placement, game.currentSong);
    }

    const winner = players.find((p) => p.timeline.length >= game.settings.winningCards);

    setGame({
      ...game,
      players,
      discardPile: correct ? game.discardPile : [...game.discardPile, game.currentSong],
      roundResult: {
        correct,
        insertedYear: game.currentSong.year,
        song: game.currentSong,
        playerName: player.name,
      },
      winnerId: winner?.id,
      finished: Boolean(winner),
      turnPhase: 'result',
    });
  };

  const handleNextTurn = () => {
    if (!game) return;

    if (game.deck.length === 0) {
      const winner = [...game.players].sort((a, b) => b.timeline.length - a.timeline.length)[0];
      setGame({ ...game, finished: true, winnerId: winner?.id });
      return;
    }

    const nextSong = game.deck[0];
    const nextDeck = game.deck.slice(1);
    const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;

    setGame({
      ...game,
      deck: nextDeck,
      currentSong: nextSong,
      currentPlayerIndex: nextPlayerIndex,
      currentPlacement: 0,
      roundResult: undefined,
      turnPhase: 'listen',
    });
  };

  const handleRestart = () => {
    clearGame();
    setGame(null);
  };

  if (loading) {
    return (
      <main className="app-shell">
        <div className="screen-card glass">
          <h2>Preparando baralho...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      {!game ? (
        <SetupScreen onStart={handleStart} />
      ) : (
        <GameScreen
          game={game}
          onSelectPlacement={(placement) => setGame({ ...game, currentPlacement: placement })}
          onConfirmMove={handleConfirmMove}
          onNextTurn={handleNextTurn}
          onMoveToPlacement={() => setGame({ ...game, turnPhase: 'place' })}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}

export default App;

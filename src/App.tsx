import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { GameScreen } from './components/GameScreen';
import { SetupScreen } from './components/SetupScreen';
import { loadSongs } from './services/songs';
import type { GameSettings, GameState, Player, SongCard } from './types';
import { insertAtPlacement, isPlacementCorrect, shuffle } from './utils/helpers';
import { clearGame, loadGame, saveGame, saveSpotifyToken } from './utils/storage';

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

  // Cada jogador começa com uma carta base na timeline
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
    finished: false,
  };
}

function App() {
  const [game, setGame] = useState<GameState | null>(() => loadGame());
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (game) saveGame(game);
  }, [game]);

  const currentPlayer = useMemo(() => (game ? game.players[game.currentPlayerIndex] : null), [game]);

  const handleStart = async (settings: GameSettings) => {
    setLoading(true);
    setStatusMessage('Carregando músicas...');

    if (settings.spotifyToken) {
      saveSpotifyToken(settings.spotifyToken);
    }

    const { songs, source } = await loadSongs({
      genres: settings.genres,
      decade: settings.decade,
      spotifyToken: settings.spotifyToken,
    });

    setStatusMessage(source === 'spotify' ? 'Usando catálogo do Spotify.' : 'Usando músicas mock locais.');
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
    });
  };

  const handleRestart = () => {
    clearGame();
    setGame(null);
    setStatusMessage('');
  };

  if (loading) {
    return (
      <main className="app-shell">
        <div className="screen-card">
          <h2>Preparando jogo...</h2>
          <p>{statusMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      {statusMessage && !game && <div className="status-banner">{statusMessage}</div>}
      {!game ? (
        <SetupScreen onStart={handleStart} />
      ) : (
        <GameScreen
          game={game}
          onSelectPlacement={(placement) => setGame({ ...game, currentPlacement: placement })}
          onConfirmMove={handleConfirmMove}
          onNextTurn={handleNextTurn}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}

export default App;

import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { GameScreen } from './components/GameScreen';
import { SetupScreen } from './components/SetupScreen';
import { getDeckFromSeed } from './services/songs';
import type { SessionState } from './types';
import { clearSession, loadSession, publishSync, saveSession, subscribeSync } from './utils/storage';

function normalizeConfig(config: SessionState['deckSeedConfig']) {
  return {
    genres: config.genres.slice().sort(),
  };
}

function App() {
  const [session, setSession] = useState<SessionState | null>(() => {
    const loaded = loadSession();
    if (!loaded) return null;
    return { ...loaded, deckSeedConfig: normalizeConfig(loaded.deckSeedConfig) };
  });
  const sourceId = useRef(crypto.randomUUID());

  const deck = useMemo(() => {
    if (!session) return [];
    return getDeckFromSeed(session.cdCode, session.deckSeedConfig);
  }, [session]);

  const activeSong = session ? deck[session.currentIndex] : null;

  useEffect(() => {
    if (!session) return;
    saveSession(session);
  }, [session]);

  useEffect(() => {
    return subscribeSync((payload) => {
      if (!session) return;
      if (payload.sourceId === sourceId.current) return;
      const sameConfig =
        payload.cdCode === session.cdCode &&
        JSON.stringify(normalizeConfig(payload.deckSeedConfig)) === JSON.stringify(normalizeConfig(session.deckSeedConfig));

      if (!sameConfig) return;

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentIndex: Math.max(0, Math.min(deck.length - 1, payload.index)),
          revealInGameScreen: false,
        };
      });
    });
  }, [deck.length, session]);

  const startSession = (nextSession: SessionState) => {
    setSession(nextSession);
  };

  const changeIndex = (nextIndex: number) => {
    if (!session) return;
    const clamped = Math.max(0, Math.min(deck.length - 1, nextIndex));
    const next = { ...session, currentIndex: clamped, revealInGameScreen: false };
    setSession(next);

    publishSync({
      sourceId: sourceId.current,
      cdCode: next.cdCode,
      index: clamped,
      deckSeedConfig: next.deckSeedConfig,
      sentAt: Date.now(),
    });
  };

  const toggleReveal = () => {
    if (!session || session.role !== 'game') return;
    setSession({ ...session, revealInGameScreen: !session.revealInGameScreen });
  };

  const restart = () => {
    clearSession();
    setSession(null);
  };

  return (
    <main className="app-shell">
      {!session || !activeSong ? (
        <SetupScreen onStart={startSession} />
      ) : (
        <GameScreen
          session={session}
          song={activeSong}
          totalTracks={deck.length}
          onChangeIndex={changeIndex}
          onToggleReveal={toggleReveal}
          onRestart={restart}
        />
      )}
    </main>
  );
}

export default App;

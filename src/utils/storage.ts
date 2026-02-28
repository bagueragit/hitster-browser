import type { SessionState, SessionSyncMessage } from '../types';

const SESSION_KEY = 'hitster-browser-session-v2';
const SYNC_KEY = 'hitster-browser-sync-v2';
const CHANNEL_NAME = 'hitster-browser-channel-v2';

let channel: BroadcastChannel | null = null;

function getChannel() {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

export function saveSession(session: SessionState): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): SessionState | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function publishSync(message: SessionSyncMessage): void {
  localStorage.setItem(SYNC_KEY, JSON.stringify(message));
  getChannel()?.postMessage(message);
}

export function subscribeSync(onMessage: (payload: SessionSyncMessage) => void): () => void {
  const bc = getChannel();
  const onBroadcast = (event: MessageEvent<SessionSyncMessage>) => onMessage(event.data);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SYNC_KEY || !event.newValue) return;
    try {
      onMessage(JSON.parse(event.newValue) as SessionSyncMessage);
    } catch {
      // ignore malformed sync payloads
    }
  };

  bc?.addEventListener('message', onBroadcast);
  window.addEventListener('storage', onStorage);

  return () => {
    bc?.removeEventListener('message', onBroadcast);
    window.removeEventListener('storage', onStorage);
  };
}

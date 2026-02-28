# Hitster Browser — Advanced Local Edition

Jogo pass-and-play inspirado em Hitster, agora **100% local** (sem Spotify API, sem token).

## O que mudou

- ✅ Removido uso da Spotify Web API e qualquer campo de token.
- ✅ Baralho local com músicas + `spotifyTrackId`.
- ✅ Fluxo fiel de rodada:
  1. Jogador da vez vê apenas **Carta oculta**.
  2. Toca em **Abrir no Spotify** (`spotify://track/{id}`).
  3. Se não abrir, usa fallback web (`https://open.spotify.com/track/{id}`).
  4. Depois escolhe posição na timeline.
  5. Só no resultado ocorre reveal (título/artista/ano).
- ✅ Metadados sensíveis escondidos até confirmação.
- ✅ Redesign premium: gradientes, glassmorphism leve, sombras e animações de feedback.
- ✅ Setup enxuto: jogadores, meta de vitória e gêneros disponíveis no baralho local.

## Stack

- React + TypeScript + Vite
- Persistência local em `localStorage`

## Rodando local

```bash
npm install
npm run dev
```

Build produção:

```bash
npm run build
npm run preview
```

## Docker

```bash
docker compose up --build -d
```

Acesse: `http://localhost:8080`

Parar:

```bash
docker compose down
```

## Estrutura principal

- `src/App.tsx`: fluxo da partida, turnos e fases (`listen` → `place` → `result`)
- `src/components/SetupScreen.tsx`: setup mínimo
- `src/components/GameScreen.tsx`: modo oculto, timeline e reveal
- `src/services/songs.ts`: baralho local e filtros
- `src/data/mockSongs.ts`: músicas locais com `spotifyTrackId`


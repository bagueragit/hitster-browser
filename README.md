# Hitster Browser (MVP local)

MVP jogável local (pass-and-play) inspirado no estilo de timeline musical do Hitster.

> Projeto **sem backend**: React + TypeScript + Vite, com persistência em `localStorage`.

## Funcionalidades

- Tela inicial para configurar partida:
  - número de jogadores (2 a 8)
  - nome dos jogadores
  - gêneros musicais
  - década opcional
  - meta de vitória (cartas corretas, padrão 10)
- Jogo pass-and-play por rodadas:
  - música da rodada
  - preview de 30s quando `preview_url` existir
  - jogador atual tenta posicionar o ano na própria timeline
- Regra aproximada:
  - acerto: carta entra na timeline do jogador
  - erro: carta vai para descarte
  - vence quem atingir o alvo de cartas corretas
- Fonte de músicas:
  - Spotify Web API (quando token válido for fornecido)
  - fallback automático para base local mock
- Persistência da partida em andamento no `localStorage`
- Layout responsivo para mobile/tablet/desktop

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Docker

Subir com Docker Compose:

```bash
docker compose up --build -d
```

Acesse em `http://localhost:8080`.

Parar container:

```bash
docker compose down
```

## GitHub Pages

Este projeto já inclui workflow em `.github/workflows/deploy-pages.yml`.

Passos:

1. Fazer push para branch `main` no GitHub.
2. No repositório, abrir `Settings > Pages` e garantir `Build and deployment: GitHub Actions`.
3. Após o workflow concluir, acessar a URL publicada em `https://<usuario>.github.io/<repositorio>/`.

## Spotify Web API (opcional)

Você pode jogar sem Spotify (fallback local), mas para usar catálogo real:

### Opção A: Token manual para desenvolvimento (mais simples)

1. Acesse o [Spotify Web API Console](https://developer.spotify.com/console/get-search-item/).
2. Faça login e gere um token OAuth temporário com escopo básico para busca.
3. Copie o token Bearer.
4. Cole no campo **Spotify token (opcional)** na tela inicial.

> Observação: token expira em pouco tempo. Quando expirar, o app volta ao fallback local.

### Opção B: PKCE no front (simplificado)

Também é possível implementar fluxo Authorization Code + PKCE 100% no front para uso pessoal/dev.
Passos gerais:

1. Criar app no Spotify Dashboard.
2. Configurar redirect URI (ex: `http://localhost:5173/callback`).
3. Gerar `code_verifier`/`code_challenge`, redirecionar para autorização e trocar `code` por token.
4. Salvar token em memória/localStorage.

Neste MVP foi priorizado **token manual** para reduzir complexidade e manter o escopo local.

## Estrutura principal

- `src/App.tsx`: orquestra setup, fluxo de jogo, turnos e persistência
- `src/components/SetupScreen.tsx`: formulário de configuração da partida
- `src/components/GameScreen.tsx`: UI da rodada, timeline e resultado
- `src/services/songs.ts`: integração Spotify + fallback mock
- `src/data/mockSongs.ts`: catálogo local de músicas mock
- `src/utils/helpers.ts`: utilitários de jogo (shuffle, validação de posição, inserção)
- `src/utils/storage.ts`: helpers de `localStorage`
- `src/types.ts`: tipos centrais da aplicação

## Regras implementadas (resumo)

- Cada jogador inicia com 1 carta base na timeline.
- Em cada rodada, o jogador ativo escolhe a posição de inserção.
- A posição é validada contra a ordem cronológica da timeline.
- Se o baralho acabar antes da meta, vence quem tiver mais cartas corretas.

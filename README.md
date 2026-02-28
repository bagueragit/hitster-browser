# Hitster Browser — 2 Aparelhos sem Backend

Versão front-end only com dois papéis:

- **Tela do Jogo (tablet)**
- **Controle DJ (celular)**

Sem servidor, sem Spotify API, mantendo abertura por link:

- app: `spotify://track/{id}`
- fallback: `https://open.spotify.com/track/{id}`

## Como funciona a sincronização

## 1) Mesmo dispositivo / mesmo navegador

Sincronização de índice em tempo real via:

- `BroadcastChannel`
- evento de `localStorage`

Se avançar faixa em uma aba, a outra acompanha (bidirecional).

## 2) Dois dispositivos diferentes (sem backend)

Não existe canal P2P confiável aqui sem sinalização/servidor.
Então a sincronização é **determinística + manual**:

1. Ambos entram com o mesmo **código CD (6 dígitos)**
2. Ambos selecionam os mesmos **gêneros**
3. O baralho é gerado com embaralhamento seedado (mesma ordem nos dois)
4. Alinhe o campo de índice (`Faixa X/Y`) quando necessário

> Importante: em aparelhos diferentes, **não prometemos sync em tempo real**.

## UX implementada

- Tela inicial com escolha de papel (Jogo/DJ)
- Campo para inserir/gerar CD
- Exibição clara do índice: `Faixa 12/100`
- DJ vê metadados + botões Spotify
- Jogo mantém metadados ocultos até **Reveal**
- Persistência local da sessão: `role`, `cdCode`, `currentIndex`, `deckSeedConfig`

## Stack

- React + TypeScript + Vite
- Persistência local (`localStorage`)
- Sync local (`BroadcastChannel` + `storage` events)

## Rodando local

```bash
npm install
npm run dev
```

Build:

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

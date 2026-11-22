# Nuke Policy

A browser-based multiplayer territorial strategy game. This is an original implementation inspired by the broad genre of global strategy simulators.

## Current build — 0.1.0
- Interactive regional map with selectable territories and adjacency links
- Abstract territory expansion, garrisons, treasury and per-turn income
- Local solo session
- Socket.IO room creation and joining for two-player sessions
- Server-authoritative capture and turn progression
- Responsive dark command-center interface

All conflict systems are fictional, simplified game mechanics. The project does not model real-world weapons, targeting, or military procedures.

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Client: http://localhost:5173  
Server health: http://localhost:3001/health

For deployment, host the `server` workspace as a Node service and the `client` workspace as a static Vite site. Set `VITE_SERVER_URL` to the public server URL before building the client.

## Roadmap
1. Lobby presence, player identity and reconnection
2. Match setup, map selection and balanced starting positions
3. Diplomacy, trade and alliances
4. AI opponents and richer map scenarios
5. Persistent profiles, match history and matchmaking

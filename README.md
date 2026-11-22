# Nuke Policy

A browser-based multiplayer geopolitical strategy game. This is an original implementation inspired by the broad genre of global strategy simulators.

## Current build — 0.2.0
- Geographic world map using country boundaries from Natural Earth / world-atlas
- 26 playable countries across the Americas, Europe, Africa, Asia and Oceania
- Country selection, coalition ownership, connected-region influence and economic income
- Local sandbox mode
- Socket.IO room creation and joining for two-player online sessions
- Server-authoritative country influence and turn progression
- Responsive command-centre interface with country intelligence panel and campaign HUD

The game uses fictional, abstract influence and economic systems. It does not model real-world weapons, targeting, or military procedures.

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Client: http://localhost:5173  
Server health: http://localhost:3001/health

For deployment, host the `server` workspace as a Node service and the `client` workspace as a static Vite site. Set `VITE_SERVER_URL` to the public server URL before building the client.

## Multiplayer
1. Start the deployed client and server.
2. One player selects **ONLINE** and creates a room.
3. Share the six-character room code with another player.
4. The second player joins using that code. The server assigns the two coalition sides and keeps the shared game state authoritative.

Rooms currently support two players and are held in server memory. They reset when the server restarts or the room becomes empty.

## Roadmap
1. More robust lobby presence, player identity and reconnection
2. Map selection and additional country sets
3. Diplomacy, trade and alliances
4. AI opponents and balanced scenarios
5. Persistent profiles, match history and matchmaking

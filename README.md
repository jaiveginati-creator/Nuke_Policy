# Nuke Policy

An original browser-based multiplayer geopolitical strategy game, inspired by the broad genre of global territory and nation-management simulators.

## Current build — 0.5.0
- Geographic world map with **71 playable countries** across every major region
- Country ownership, connected-region influence and coalition control
- Turn-based campaign with two strategic actions per phase
- Solo campaign against an AI rival that expands influence and develops industry
- Country economies with treasury, population and recurring regional income
- Buildable city districts, industrial complexes and trade ports
- Online two-player rooms with server-authoritative actions and alternating turns
- Multiplayer lobby presence, room codes and disconnect cleanup
- Campaign activity log, country intelligence and responsive command-centre interface

All conflict-related mechanics are fictional and abstract. The game focuses on territory, economic development and diplomatic influence; it does not simulate real-world weapons or military procedures.

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Client: http://localhost:5173  
Server health: http://localhost:3001/health

## Online multiplayer
Deploy the `server` workspace as a persistent Node service and the `client` workspace as a static Vite site. Set `VITE_SERVER_URL` to the public server URL before building the client.

1. Open the client and choose **ONLINE**.
2. Create a room and share its six-character code.
3. The other player joins using that code.
4. The Blue and Red coalitions take alternating phases. Each phase has two actions; the server validates actions and broadcasts the shared state.

Rooms are currently held in server memory and reset when the server restarts or the room becomes empty. Persistent saves and reconnect recovery are future work.

## Current strategic systems
- **Influence:** Extend your coalition into adjacent countries when you have sufficient influence and credits.
- **City districts:** Spend credits to increase a country's recurring income.
- **Industry:** Build industrial capacity for a larger income increase.
- **Trade ports:** Add trade infrastructure and recurring income.
- **Economy:** Owned countries contribute income at the end of their coalition phase.
- **AI rival:** In solo mode, Red uses its actions to expand or invest in industry.

## Roadmap
1. More detailed territory subdivisions and zoom-level map presentation
2. Stronger AI strategy and selectable difficulty
3. Diplomacy, trade agreements, alliances and shared projects
4. Match settings, spectator mode and larger multiplayer rooms
5. Persistent accounts, saved campaigns and reconnection support
6. Scenario editor and additional map configurations

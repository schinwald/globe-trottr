![World Wide Wonders](/logo.svg)

# 🌍 World Wide Wonders

A multiplayer geography game where players compete to identify countries on a globe. Challenge your friends and test your knowledge of world geography!

## ✨ Features

- **🌐 Interactive Globe Interface** - Spin and zoom a 3D globe to locate countries
- **👥 Multiplayer Rooms** - Create private rooms and invite friends to play together
- **⏱️ Timed Rounds** - Race against the clock to identify as many countries as possible
- **🔗 QR Code Room Sharing** - Easy room joining via QR codes
- **🌈 Beautiful UI** - Smooth animations and a polished user experience

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
docker compose up
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Manual Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development servers:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to start playing!

## 🎮 How to Play

1. **Create or Join a Room** - Start a new game room or join an existing one using a room code
2. **Wait for Players** - Invite friends to join your room
3. **Start the Game** - Once everyone is ready, start the round
4. **Guess Countries** - Click on the globe to identify the highlighted country
5. **Race Against Time** - The first player to guess correctly wins the round!

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for the web app
- **Tailwind CSS** - Utility-first styling
- **React Globe.gl** - Interactive 3D globe visualization
- **tRPC** - End-to-end typesafe APIs
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - Server runtime
- **tRPC** - Type-safe API layer
- **WebSockets** - Real-time game state synchronization
- **Redis** - Pub/sub for real-time state

### Shared
- **TypeScript** - Type safety across the codebase
- **Turbo** - Monorepo build system

## 📜 Available Scripts

In the project root directory, you can run:

### `pnpm dev`
Runs all apps in development mode using Turbo.

### `pnpm build`
Builds all apps for production.

### `pnpm lint`
Runs linting across all packages.

### `pnpm format`
Formats code using Biome.

### `pnpm generate:code`
Generates types and API code.

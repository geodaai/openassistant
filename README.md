# openassistant2

AI Assistant library for spatial data analysis and visualization with kepler.gl.

Built on [sqlrooms](https://sqlrooms.org), [Vercel AI SDK](https://sdk.vercel.ai), Tailwind CSS v4, and Zustand.

## Features

- **Chat Component** - Ready-to-use AI chat panel with session management, model selection, and settings
- **Tools** - Spatial analysis tools (ECharts plots, geo operations, LISA, SQL queries, kepler.gl operations)
- **Agents** - Multi-agent architecture with specialized sub-agents (Kepler, ECharts, Geo, LISA)
- **Store** - Zustand-based state management with sqlrooms slice composition

## Installation

```bash
npm install openassistant2
```

## Usage with kepler.gl

```tsx
import {createAiAssistantStore, AiAssistantPanel} from 'openassistant2';
import 'openassistant2/styles.css';

// Create the store with a bridge to kepler.gl's Redux state
const {roomStore, useRoomStore, onSelected} = createAiAssistantStore({
  getVisState: () => store.getState().demo.keplerGl.map.visState,
  getMapBoundary: () => { /* return map bounds */ },
  getMapboxToken: () => process.env.MapboxAccessToken,
  dispatch: store.dispatch,
});

// Render the panel
<AiAssistantPanel roomStore={roomStore} onSelected={onSelected} />
```

## CSS Integration

The library uses Tailwind CSS v4. To integrate with non-Tailwind projects (like kepler.gl), import the pre-built CSS:

```js
import 'openassistant2/styles.css';
```

## Dependency Alignment

When used with kepler.gl, ensure shared dependencies use the same versions via resolutions:

```json
{
  "resolutions": {
    "apache-arrow": ">=15.0.0",
    "zustand": "^5.0.8"
  }
}
```

## Development

### Prerequisites

- Node.js >= 20
- [yarn](https://yarnpkg.com/) (v4) or [pnpm](https://pnpm.io/) (v10+)

### Setup

Clone the repo and install dependencies:

**Using yarn:**

```bash
git clone https://github.com/geodaai/openassistant2.git
cd openassistant2
yarn install
```

**Using pnpm:**

```bash
git clone https://github.com/geodaai/openassistant2.git
cd openassistant2
pnpm install
```

### Build

The build has two steps: TypeScript/JS bundling via [tsup](https://tsup.egoist.dev/) and CSS generation via the Tailwind CSS v4 CLI.

```bash
# Full build (JS + CSS)
yarn build   # or: pnpm build

# JS only
yarn build:js   # or: pnpm build:js

# CSS only
yarn build:css   # or: pnpm build:css

# Watch mode (JS only, rebuilds on change)
yarn dev   # or: pnpm dev

# Type-check without emitting
yarn typecheck   # or: pnpm typecheck

# Remove build artifacts
yarn clean   # or: pnpm clean
```

Build output lands in `dist/`:

| File | Description |
|------|-------------|
| `index.js` | ESM bundle |
| `index.d.ts` | TypeScript declarations |
| `index.js.map` | Source map |
| `styles.css` | Pre-built Tailwind CSS |

### Project Structure

```
src/
├── agents/          # Sub-agent definitions (Kepler, ECharts, Geo, LISA)
├── components/      # React components (chat panel, ECharts renderers)
├── config/          # AI model configuration
├── styles/          # Tailwind CSS input
├── tools/           # Tool implementations
│   └── kepler-tools/  # kepler.gl-specific tools
├── constants.ts     # System prompt / instructions
├── store.ts         # Zustand store factory
├── types.ts         # Shared TypeScript types
└── index.ts         # Public API entry point
```

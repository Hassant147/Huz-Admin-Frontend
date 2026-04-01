# Huz Admin Frontend

React + Vite admin frontend for Huz management and partner-control flows.

## Prerequisites

- Node.js 18+
- npm 9+

## Environment

Create a local `.env` file in the repo root when you need to point the app at a specific backend:

```bash
REACT_APP_API_BASE_URL=https://hajjumrah.org
```

If `REACT_APP_API_BASE_URL` is omitted, the app currently falls back to `https://hajjumrah.org`. Set it explicitly for local or staging work so development traffic does not silently target production.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The Vite dev server runs on [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test
```

Vitest runs in `jsdom` and picks up files matching `src/**/*.{test,spec}.{js,jsx,ts,tsx}`.

## Production Build

```bash
npm run build
```

The production bundle is emitted to `build/`.

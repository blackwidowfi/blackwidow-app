# BlackWidow

Autonomous, risk-aware yield aggregation on Solana.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Stack

- **Framework** — TanStack Start (SSR, file-based routing)
- **Styling** — Tailwind CSS v4 + shadcn/ui
- **Build** — Vite+ (`vp` CLI)
- **Server** — Nitro
- **Analytics** — PostHog

## Development

```bash
vp dev --port 3000   # start dev server
vp check --fix       # format, lint, type-check
vp test run          # run tests
```

## Build & Deploy

```bash
vp build
node dist/server/index.mjs
```

The build output is a self-contained Node server. For platform-specific presets (Vercel, Fly.io, Cloudflare, etc.) see the [Nitro deploy docs](https://v3.nitro.build/deploy).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable            | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `VITE_POSTHOG_KEY`  | PostHog project API key                                        |
| `VITE_POSTHOG_HOST` | PostHog host (optional, defaults to `https://app.posthog.com`) |

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add <component>
```

Components land in `src/lib/ui/`.

## Project Structure

```
src/
  app/              # routes + page components (TanStack file-based routing)
    -components/    # shared UI components (- prefix = ignored by router)
    __root.tsx      # root layout, SEO meta
    index.tsx       # landing page
  lib/
    translation/    # i18next config + locale files
    ui/             # shadcn components + utilities
```

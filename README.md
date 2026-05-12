# Blackwidow

**Autonomous, risk-aware yield aggregation on Solana.**

Blackwidow routes capital across Solana DeFi protocols in real time, continuously optimizing for yield while a proprietary risk engine monitors oracle deviations, TVL anomalies, and on-chain signals to protect positions before threats materialize.

> MVP stage · Solana Devnet · Non-custodial · Audit in progress

---

## Table of Contents

- [Getting Started](#getting-started)
- [Stack](#stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Vite+](https://viteplus.dev/guide/) (`vp` CLI) — installed globally or via the project

### Install & Run

```bash
vp install       # install dependencies
vp dev           # start dev server at http://localhost:3000
```

### Other Commands

```bash
vp check --fix   # format, lint, and type-check
vp test run      # run tests
vp build         # production build
```

### Contracts Submodule

The `contracts/` directory is a git submodule pointing to [`blackwidow-contracts`](https://github.com/blackwidowfi/blackwidow-contracts).

```bash
git submodule update --init --recursive
```

---

## Stack

| Layer     | Technology                                                             |
| --------- | ---------------------------------------------------------------------- |
| Framework | [TanStack Start](https://tanstack.com/start) — SSR, file-based routing |
| Styling   | Tailwind CSS v4 + shadcn/ui                                            |
| Build     | [Vite+](https://viteplus.dev) (`vp` CLI)                               |
| Server    | Nitro                                                                  |
| Analytics | PostHog                                                                |
| Chain     | Solana (Jupiter, Meteora, Kamino)                                      |

---

## Project Structure

```
src/
  app/                   # routes + page components
    -components/         # shared UI components (- prefix = ignored by router)
    __root.tsx           # root layout, SEO meta
    index.tsx            # landing page
  lib/
    translation/         # i18next config + locale files
    ui/                  # shadcn components + utilities
contracts/               # on-chain programs (git submodule)
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

| Variable            | Description                                       |
| ------------------- | ------------------------------------------------- |
| `VITE_POSTHOG_KEY`  | PostHog project API key                           |
| `VITE_POSTHOG_HOST` | PostHog host (default: `https://app.posthog.com`) |
| `SOLANA_NETWORK`    | `devnet` or `mainnet-beta`                        |

---

## Deploy

The build output is a self-contained Node server:

```bash
vp build
node dist/server/index.mjs
```

For platform-specific presets (Vercel, Fly.io, Cloudflare Workers, etc.) see the [Nitro deploy docs](https://v3.nitro.build/deploy).

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request for non-trivial changes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Open a pull request

---

## License

[MIT](./LICENSE)

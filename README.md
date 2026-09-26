<p align="center">
  <img src="src/logo.svg" alt="Giftistry" width="120" />
</p>

<h1 align="center">Giftistry</h1>

<p align="center">
  <strong>Self-hosted wishlists that stay private, shareable, and actually useful.</strong>
</p>

<p align="center">
  <a href="#"><img alt="License" src="https://img.shields.io/badge/license-TODO-blue.svg" /></a>
  <a href="#"><img alt="Status" src="https://img.shields.io/badge/status-early%20access-orange.svg" /></a>
  <a href="#"><img alt="React" src="https://img.shields.io/badge/react-19-61dafb.svg" /></a>
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#documentation">Docs</a> ·
  <a href="#contributing">Contributing</a>
</p>

---

Giftistry is for birthdays, holidays, and everyday “what would you like?” moments. You keep the list, you choose who sees it, and friends can claim items so gifting stays simple and surprise-friendly. This repo is the frontend; you’ll run it with the Giftistry API.

> **Note**  
> Screenshots and a public demo URL go here when you have them. Immich/Jellyfin-style READMEs lead with a visual — one hero image beats three paragraphs.

## Features

| | |
| :--- | :--- |
| **Wishlists** | Create lists, organize by bucket, archive, and keep ownership clear |
| **Items & claims** | Multiple view modes, substitutions, group funding, and claim coordination |
| **Sharing & invites** | Share with friends, link invites (optional password), guest preview |
| **Friends** | Requests, search, and birthday-aware connections |
| **Comments** | Threads, reactions, and live presence on a list |
| **Import & jobs** | File import plus AI enrich/summarize when the server enables AI |
| **Notifications** | In-app bell, preferences, and optional push |
| **Theming** | Presets, light/dark/system, holiday unlocks, and custom themes |
| **Admin & server** | Site policy and server config for owners/admins |
| **Privacy-first** | Self-host the stack; you keep the data |

## Getting started

**Self-host (Docker / NixOS):** use the packaging repo [`giftistry`](../giftistry) — [Compose](../giftistry/docs/install/docker.md) or [`services.giftistry`](../giftistry/docs/install/nixos.md).

### Local web development

```bash
# Install
bun install   # or: npm install

# Dev server (Vite) — API expected at http://localhost:3001
bun run dev

# Optional: client + API together
bun run dev:all
```

Open the URL Vite prints (typically `http://localhost:5173`).

For a full local environment, API config, and troubleshooting, see [docs/development.md](docs/development.md) and the packaging [development guide](../giftistry/docs/development.md).

## Documentation

| Doc | What it's for |
| --- | --- |
| [Architecture](docs/architecture.md) | Layers (`app` / `features` / `shared` / `core`) + SoC rules |
| [Source map](src/README.md) | Folder map + application diagrams (providers, routes, realtime) |
| [Features](src/features/README.md) | Domain packages (auth, wishlists, items, …) |
| [Development](docs/development.md) | Scripts, env, audits, tests |
| [UI conventions](docs/ui-conventions.md) | SoC trio, CSS Modules, interfaces |
| [Contributing](CONTRIBUTING.md) | PR contract |
| [Scripts](scripts/README.md) | Repo tooling (theme sync, audits, `dev:all`) |

Layer detail lives under [`src/app`](src/app/README.md), [`src/features`](src/features/README.md), [`src/shared`](src/shared/README.md), and [`src/core`](src/core/README.md).

## Stack

- **Runtime / tooling:** Bun (preferred), Vite  
- **UI:** React 19, React Router, CSS Modules  
- **Language:** TypeScript (strict)  
- **Tests:** Vitest + Testing Library  

## Contributing

Ideas, bugs, and PRs are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), then skim [docs/architecture.md](docs/architecture.md) so new UI lands in the right layer.

## License

TODO — add your license (e.g. AGPL / MIT / proprietary) and link the full text.

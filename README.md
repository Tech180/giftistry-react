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

Giftistry helps people collect gifts, share lists with friends and family, and coordinate claims — without stuffing your data into someone else's SaaS. This repository is the **React web client**; pair it with the Giftistry API for a full stack.

> **Note**  
> Screenshots and a public demo URL go here when you have them. Immich/Jellyfin-style READMEs lead with a visual — one hero image beats three paragraphs.

## Features

| | |
| :--- | :--- |
| **Wishlists** | Create lists, organize items, and keep ownership clear |
| **Sharing** | Invite friends, control who sees what, accept invites in-app |
| **Claims** | Mark gifts claimed so nobody doubles up |
| **Friends** | Stay connected around birthdays and gifting moments |
| **Theming** | Appearance and holiday themes that feel like *your* product |
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
| [Architecture](docs/architecture.md) | Layers (`app` / `features` / `shared` / `core`), SoC |
| [Development](docs/development.md) | Scripts, audits, tests, env |
| [UI conventions](docs/ui-conventions.md) | SoC trio, CSS Modules, interfaces |
| [Contributing](CONTRIBUTING.md) | PRs, style, review expectations |
| [Source map](src/README.md) | Nested folder READMEs under `src/` |

## Stack

- **UI:** React 19, React Router, Vite, CSS Modules  
- **Language:** TypeScript (strict)  
- **Tests:** Vitest + Testing Library  

## Contributing

Ideas, bugs, and PRs are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), then skim [docs/architecture.md](docs/architecture.md) so new UI lands in the right layer.

## License

TODO — add your license (e.g. AGPL / MIT / proprietary) and link the full text.

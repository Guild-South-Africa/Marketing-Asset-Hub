# GUILD SA Marketing Asset Hub

Production-ready campaign asset generator for **GUILD SA AI Buildathon 01**. Browse, preview, and export posters, social graphics, signage, and print assets at full native resolution — mapped to the brand’s design template system.

## Features

- **Dashboard** — campaign overview, milestones, and quick navigation
- **Asset Gallery** — browse all assets by campaign phase (Tease, Registration, Event Week, Physical & Print, etc.)
- **Campaign Timeline** — scheduled rollout aligned to event dates
- **Live Preview** — each asset renders in-browser at exact design dimensions
- **PNG Export** — download full-resolution files (e.g. 2160×2700 posters) via one click
- **Brand System** — Müller-Brockmann 12-column grid, Rubik/Inter typography, partner lockups (Lovable, Eduvos, VelozTech)
- **Layout Variants** — poster, square, landscape, signage, countdown, event program, ecosystem, partner cards, and more

## Tech Stack

| Layer | Tools |
|-------|-------|
| UI | React 19, React Router 7, Tailwind CSS 4 |
| Build | Vite 8, TypeScript 6 |
| Export | html2canvas |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm

The app reads brand assets from the parent workspace folder (`Brand/`, `Event/`, `Stocks/`, `Marketing/`). Run it from within the full GUILD SA repo — not as a standalone copy without those folders.

## Getting Started

```bash
cd marketing-hub
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

Static output is written to `dist/`.

## Usage

1. Open **Asset Gallery** or pick a phase from the dashboard.
2. Click any asset to open its detail page.
3. Review the live preview (scaled to fit your screen).
4. Click **Download PNG** to export at the asset’s native width and height.

Export clones the design at full size off-screen, applies cover-fit corrections for stock photos, and saves a PNG — no CSS transform scaling artifacts.

## Project Structure

```
marketing-hub/
├── src/
│   ├── components/
│   │   ├── assets/          # Design rendering (TemplateDesign, grid, brand elements)
│   │   ├── layout/          # App shell, navigation
│   │   ├── AssetGallery.tsx
│   │   ├── AssetViewer.tsx
│   │   └── ExportButton.tsx
│   ├── data/
│   │   ├── assetRegistry.ts # All campaign assets and copy
│   │   ├── templateMeta.ts  # Per-template visual config (CTA, layout, hero numbers)
│   │   ├── brand.ts         # Colors, fonts, event facts
│   │   ├── gridSystem.ts    # 12-col grid scale helpers
│   │   ├── timeline.ts      # Campaign schedule
│   │   └── types.ts         # Shared TypeScript types
│   ├── pages/               # Route pages
│   └── utils/
│       ├── exportAsset.ts   # PNG export pipeline
│       ├── imageCover.ts    # Aspect-ratio-safe photo cropping
│       └── assetPaths.ts    # Brand, partner, and stock image imports
└── vite.config.ts           # Path aliases to workspace assets
```

### Workspace asset paths (parent folder)

| Alias | Folder | Contents |
|-------|--------|----------|
| `@brand` | `../Brand` | GUILD SA logos (Master Logo, Guild sa white, etc.) |
| `@event` | `../Event` | Partner logos (Lovable, Eduvos, VelozTech) |
| `@stocks` | `../Stocks` | Stock photography (`brand stock1.png` …) |
| `@templates` | `../Marketing/png` | Template reference images |

## Customization

### Add or edit campaign content

Edit `src/data/assetRegistry.ts`. Each entry defines:

- Dimensions (`width`, `height`, `format`)
- Campaign phase and channels
- `templateSlug` — links to visual config in `templateMeta.ts`
- `content` — headline, body, CTA, agenda, stats, etc.
- `stockIndex` — which stock photo to use (0-based)

### Adjust template visuals

Edit `src/data/templateMeta.ts` for footer CTAs, dark mode, hero numbers, index labels, and layout variant overrides.

### Update event details

Edit `src/data/brand.ts` — date, location, builder counts, and brand colors propagate across all designs.

### Logos on dark backgrounds

Dark designs use `Brand/Guild sa white.png`. Light designs use `Brand/Master Logo.png`. Partner logos switch automatically via `src/utils/assetPaths.ts`.

## Design System Notes

- **Grid reference width:** 1600px (`scale = assetWidth / 1600`)
- **Formats:** poster (2160×2700), social (1600×2000), square (1600×1600), landscape (1920×1080), signage (2160×3840)
- **Stock photos** use manual cover-fit (not CSS `object-fit`) so exports stay undistorted in html2canvas
- **Text layout** uses column constraints, dynamic CTA sizing, and overflow clipping to prevent overlap on export

## Deployment (GitHub Pages)

The app deploys automatically to GitHub Pages on every push to `main`.

**Live site:** https://guild-south-africa.github.io/Marketing-Asset-Hub/

### One-time GitHub setup

1. Open [Marketing-Asset-Hub](https://github.com/Guild-South-Africa/Marketing-Asset-Hub) → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**

The workflow in `.github/workflows/deploy.yml` builds `marketing-hub/` and publishes `dist/` to Pages.

### Manual deploy trigger

Push to `main`, or run the **Deploy to GitHub Pages** workflow from the **Actions** tab.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |

## License

Private — GUILD SA / OCS Building Design Studio. All brand assets and templates are for internal campaign use.

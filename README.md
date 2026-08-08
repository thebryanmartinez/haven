# ByteFin Monorepo

A pnpm + Turborepo monorepo for my personal web applications. Every application uses
the same component library, the same theme, the same conventions and the same Convex
backend.

## Applications

| Path | Name | What it does |
| --- | --- | --- |
| `apps/bytefin` | ByteFin | Subdivides one bank account into funds and tracks the transactions in each fund |

## Packages

| Path | Name | What it holds |
| --- | --- | --- |
| `packages/ui` | `@bytefin/ui` | Shadcn UI primitives, the theme tokens, `ThemeProvider`, `ThemeToggle`, `cn()` |
| `packages/backend` | `@bytefin/backend` | The Convex schema, queries and mutations that every application shares |
| `packages/localization` | `@bytefin/localization` | The typed `t()` helper factory |
| `packages/config` | `@bytefin/config` | The shared TypeScript, Biome and PostCSS configuration |

## Stack

Next.js 16 (App Router) · React 19 · TailwindCSS v4 · Shadcn UI · Convex · Biome ·
TypeScript · pnpm workspaces · Turborepo

## Start

```bash
pnpm install

# fill the environment files
cp packages/backend/.env.example packages/backend/.env.local
cp apps/bytefin/.env.example apps/bytefin/.env.local

# push the Convex functions one time
pnpm --filter @bytefin/backend push

# start everything (applications + Convex watch)
pnpm dev
```

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server of every application |
| `pnpm dev --filter bytefin` | Start one application |
| `pnpm build` | Production build of every application |
| `pnpm lint` | Biome check across the workspace |
| `pnpm format` | Biome format (writes changes) |
| `pnpm typecheck` | TypeScript check of every workspace |
| `pnpm backend` | `convex dev` for the shared backend |
| `pnpm gen app` | Create a new application |

## Add a new application

```bash
pnpm gen app
pnpm install
cp apps/<name>/.env.example apps/<name>/.env.local   # add the Convex URL
pnpm dev --filter <name>
```

The generator makes a full Next.js application with the shared UI, the shared backend,
the shared localization helper and the shared configuration already connected. Its
templates are in `turbo/generators/templates/app/`.

## Add a Shadcn component

Run the CLI inside the UI package so every application gets the component:

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component>
```

Then add the export to `packages/ui/src/components/index.ts`.

## Change the look

All theme tokens are in `packages/ui/src/styles/globals.css`. Change them there and
every application follows.

## Convex

Every application shares one Convex deployment. Give the tables of a new application a
prefix (for example `habit_tracker_entries`) and declare them in
`packages/backend/convex/schema.ts`.

**Careful:** the old stand-alone repository at `../bytefin` still points at the same
deployment. Do not run `convex dev` in both places at the same time.

## Branches

Feature branches (`feature/<name>`) merge into `develop`. `develop` merges into `main`
through a pull request.

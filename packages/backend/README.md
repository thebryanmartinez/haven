# @bytefin/backend

The Convex backend that every application in the monorepo shares.

## Commands

```bash
pnpm --filter @bytefin/backend dev    # watch and push the functions
pnpm --filter @bytefin/backend push   # push one time and stop
pnpm --filter @bytefin/backend deploy # deploy to production
```

## Rules

- One deployment holds the tables of every application. Give the tables of a new
  application a prefix, for example `blog_posts`, so two applications do not use
  the same table name.
- Declare every table in `convex/schema.ts`.
- Do not run `convex dev` in two directories at the same time on the same
  deployment. The old stand-alone `bytefin` repository points at the same
  deployment.

## Imports

```ts
import { api } from "@bytefin/backend/api";
import type { Id } from "@bytefin/backend/dataModel";
import { getNewBalance } from "@bytefin/backend/lib/balance";
```

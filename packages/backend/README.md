# @haven/backend

The Convex backend that every application in the monorepo shares.

## Commands

```bash
pnpm --filter @haven/backend dev    # watch and push the functions
pnpm --filter @haven/backend push   # push one time and stop
pnpm --filter @haven/backend deploy # deploy to production
```

## Rules

- One deployment holds the tables of every application. Give the tables of a new
  application a prefix, for example `blog_posts`, so two applications do not use
  the same table name.
- Declare every table in `convex/schema.ts`.
- Do not run `convex dev` in two directories at the same time on the same
  deployment.

## Imports

```ts
import { api } from "@haven/backend/api";
import type { Id } from "@haven/backend/dataModel";
import { getNewBalance } from "@haven/backend/lib/balance";
```

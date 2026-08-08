# CLAUDE.md — apps/bytefin

Read the `CLAUDE.md` in the repository root first. It holds the monorepo rules, the
package list and the shared conventions. This file only adds what is special about
ByteFin.

## What it is

ByteFin subdivides one bank account into multiple "funds" (Savings, Groceries, Rent)
and tracks the transactions inside each fund. It is used mainly on mobile, but it
supports desktop too. It is installable as a PWA (`public/manifest.json`,
`public/sw.js`, the icons in `public/`).

## Commands

```bash
pnpm dev --filter bytefin     # dev server on port 3000
pnpm build --filter bytefin   # production build
```

## Modules

- `src/modules/funds/` — the main feature. `useFunds` and `useAccounts` wrap the Convex
  queries and mutations; the components never call Convex directly.
- `src/modules/authentication/` — the PIN gate. It stays inside this application.
- `src/modules/shared/` — `Header`, `Loading`, `EmptyState`, `useDialog`,
  `useLocalization`, `en.json`.

## Balance rules

There is one shared `accounts` document that the funds allocate balance from. Changing
a fund's balance and changing the account's balance are two separate mutations
(`updateFundBalance`, `updateAccountBalance`). The caller must keep them in sync. Both
use `getNewBalance` from `@bytefin/backend/lib/balance`.

`AddTransactionDialog` builds its validation schema for each transaction type (deposit
or withdraw) with `addTransactionSchema(t, getContext)`. Withdrawals are validated
against the current balance of the fund.

## Auth

`POST /api/validate-pin` compares the submitted PIN against `NEXT_LOGIN_PIN` and
returns `{ valid }`. `useAuth` then stores an `isAuthenticated` flag in
`sessionStorage`. There is no server-side session, no cookie and no middleware. Each
page component checks `useAuth().isAuthenticated` and redirects to `/login` itself.

## Env vars

`NEXT_PUBLIC_CONVEX_URL`, `NEXT_LOGIN_PIN` (see `.env.example`).

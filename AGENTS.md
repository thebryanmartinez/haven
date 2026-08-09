This is a pnpm + Turborepo monorepo for my personal web applications. Every
application uses Next.js, TailwindCSS and Shadcn, with the database in Convex. The
applications share one component library (`@haven/ui`), one Convex deployment
(`@haven/backend`), one localization helper (`@haven/localization`) and one set of
TypeScript, Biome and PostCSS configs (`@haven/config`).

`apps/pockets` is the first application: it manages and separates my savings account
into my multiple goals, and it tracks every dollar inside that savings account. The
applications support both desktop and mobile views, but they are mainly used in mobile
view.

Read `CLAUDE.md` in the repository root for the full guidance.

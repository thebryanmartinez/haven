# Add a new application

```bash
pnpm gen app          # asks for a name, a description and a port
pnpm install
cp apps/<name>/.env.example apps/<name>/.env.local   # add the Convex URL
pnpm dev --filter <name>
```

The generator produces a full Next.js application with the shared UI, the shared backend, the shared localization helper and the shared configs already connected. Its templates live in `turbo/generators/templates/app/`.

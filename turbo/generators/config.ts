import type { PlopTypes } from "@turbo/gen";

/**
 * Generators for the ByteFin monorepo.
 *
 * Run `pnpm gen app` and give a name. The generator makes a full Next.js
 * application in `apps/<name>`. The application already uses the shared UI
 * package, the shared Convex backend, the shared localization helper and the
 * shared TypeScript, Biome and PostCSS configuration.
 *
 * After the generator finishes:
 *   1. pnpm install
 *   2. copy apps/<name>/.env.example to apps/<name>/.env.local and fill it
 *   3. pnpm dev --filter <name>
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("app", {
    description: "Create a new Next.js application in apps/",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Application name (kebab-case, for example 'habit-tracker'):",
        validate: (input: string) => {
          if (!input) return "The name is necessary.";
          if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input)) {
            return "Use lowercase letters, numbers and dashes only.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Short description:",
        default: "A ByteFin monorepo application",
      },
      {
        type: "input",
        name: "port",
        message: "Dev server port:",
        default: "3001",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/apps/{{ dashCase name }}",
        base: "templates/app",
        templateFiles: "templates/app/**/*",
        globOptions: { dot: true },
        stripExtensions: ["hbs"],
      },
      (answers) => {
        const { name } = answers as { name: string };
        return [
          "",
          `Created apps/${name}.`,
          "",
          "Next steps:",
          "  1. pnpm install",
          `  2. cp apps/${name}/.env.example apps/${name}/.env.local`,
          "     Put the CONVEX_URL of packages/backend/.env.local in it.",
          `  3. pnpm dev --filter ${name}`,
          "",
          "Add the tables of this application to packages/backend/convex/schema.ts.",
          `Give them the prefix '${name.replace(/-/g, "_")}_'.`,
          "",
        ].join("\n");
      },
    ],
  });
}

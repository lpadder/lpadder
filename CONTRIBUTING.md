# Contributing to lpadder

lpadder was made using [Vite](https://vitejs.dev), [SolidJS](https://solidjs.com), [TypeScript](https://www.typescriptlang.org), [UnoCSS](https://unocss.dev) and [pnpm](https://pnpm.io/) is the main package manager. Deployment is powered by [Vercel](https://vercel.com) on [@Vexcited](https://github.com/Vexcited)'s account.

## Commands

- `pnpm dev`: Starts development server on port `3000`.
- `pnpm build`: Lints and builds the app.
- `pnpm lint`: Runs `eslint` and `tsc`.
- `pnpm release`: Runs `pnpm lint`, bumps the `version` in `package.json`, commits the changes and tag, then creates a GitHub Release.
  - Note: the published GitHub release will trigger a GitHub Action that will run a Vercel build. On successful deploy, it will update the published GitHub release and append `Deployment URL: <VERCEL_DEPLOY_URL>\n\n` at the top of the release body.

## Explaining the "lpadder project file structure"

Each covers is bundled into a `.zip` file that contains a single `cover.json` file.
This file contains the project's global configuration and data.

You can see its interface (`ProjectStructure`) in the [`Project.ts`](./src/types/Project.ts) file.

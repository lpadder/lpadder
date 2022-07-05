# lpadder: Build your next cover with lpadder.

![GitHub - Social Banner](https://user-images.githubusercontent.com/59152884/177166304-5c79187c-4e43-4b37-8df3-9bd5d5130603.png)

<p align="center">
  <a href="https://lpadder.vercel.app" target="_blank"><img src="https://img.shields.io/static/v1?&label=&message=go to lpadder&color=%231E293B&style=for-the-badge"/></a> 
  <a href="https://docs-lpadder.vercel.app" target="_blank"><img src="https://img.shields.io/static/v1?&label=&message=documentation&color=%231E293B&style=for-the-badge"/></a>
  <br />
  <a href="https://dsc.gg/lpadder" target="_blank"><img src="https://img.shields.io/discord/989809458907602977?color=%231E293B&label=discord&labelColor=%231E293B&style=for-the-badge"/></a>
</p>

---

`lpadder` (pronounced `el padder` or `launchpadder`) is a web
application - **still in development** - that lets you play Launchpad covers directly from your web browser.

In the future, [mini-games](https://github.com/Vexcited/lpadder/issues/26) will be available.

This is currently a work in progress. You can still
preview the latest release version by going to <https://lpadder.vercel.app>.

If you have any idea of feature to add, head on the [issues](https://github.com/Vexcited/lpadder/issues) and
create a new issue with the `feature request` template.

## Explaining the "lpadder project file structure"

Each covers is bundled into a `.zip` file that contains a single `cover.json` file.
This file contains the project's global configuration and data.

You can see its interface (`ProjectStructure`) in the [`Project.ts`](./src/types/Project.ts) file.

## Development

lpadder was made using [Vite](https://vitejs.dev), [SolidJS](https://solidjs.com), [solid-start](https://github.com/solidjs/solid-start), [TypeScript](https://www.typescriptlang.org) and [WindiCSS](https://windicss.org). Deployment is powered by [Vercel](https://vercel.com). [pnpm](https://pnpm.io/) is the main package manager. Finally, [MongoDB Atlas](https://www.mongodb.com/atlas/database) is used to host the main database.

- `pnpm dev`: Starts `solid-start` development server on port `3000`.
  - Note: if you use a reverse proxy to access the development server, you'll need to change the `CLIENT_PORT` environment variable in `.env.local`  - a sample is available under `.env.sample`. The default value is `3000`.
- `pnpm build`: Lints and builds the app.
- `pnpm lint`: Runs `eslint` and `tsc`.
- `pnpm release`: Runs `pnpm lint`, bumps the `version` in `package.json`, commits the changes and tag, then creates a GitHub Release.
  - Note: the published GitHub release will trigger a GitHub Action that will run a Vercel build. On successful deploy, it will update the published GitHub Release and append `Deployment URL: <VERCEL_DEPLOY_URL>\n\n` at the top of the release body.

If you want to contribute, please check [the roadmap](https://github.com/Vexcited/lpadder/projects/1).

## Credits

- [mat1jaczyyy](https://github.com/mat1jaczyyy), for the [LP-Firmware-Utility](https://github.com/mat1jaczyyy/LP-Firmware-Utility) where a lot of device identification code has been taken.
- [203Null](https://github.com/203Null) and [203Electronics](https://github.com/203Electronics) for [Prismatic](https://github.com/203Electronics/Prismatic) where a lot of SysEx initialization code has been taken.
- [Novation](https://novationmusic.com) for the Launchpads and their programmer documentations.
  - [Launchpad Pro MK2](https://fael-downloads-prod.focusrite.com/customer/prod/s3fs-public/downloads/Launchpad%20Pro%20Programmers%20Reference%20Guide%201.01.pdf)
  - [Launchpad Pro MK3](https://fael-downloads-prod.focusrite.com/customer/prod/s3fs-public/downloads/LPP3_prog_ref_guide_200415.pdf)
  - [Launchpad X](https://fael-downloads-prod.focusrite.com/customer/prod/s3fs-public/downloads/Launchpad%20X%20-%20Programmers%20Reference%20Manual.pdf)

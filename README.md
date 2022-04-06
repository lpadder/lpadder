# lpadder: Play Launchpad covers directly from your browser.

![GitHub - Social Banner](https://user-images.githubusercontent.com/59152884/162007722-4f9df4b9-b293-4ae2-bcfa-4b4b8e25ce70.png)

`lpadder` (pronounced `el padder` or `launchpadder`) is a web
application - **still in development** - that lets you play
Launchpad covers directly from your web browser.

It feature project editing, playing, saving current project ...
It also have some utilities like an Ableton parser
that will give you more informations about an Ableton
Launchpad project.

In the future, we want to make this able to
convert Ableton projects to Unipad projects
or lpadder projects.

## What is missing ?

There's lists of what I need to work on to make this app better !
It can also help the contributors to know what they can work on.

### Project Management
- [ ] Add something to build and create changelogs programmatically (thinking of using `release-it`)
  - [ ] Add a changelog for the project (`./src/assets/changelogs.json`) to access them from lpadder (and then be able to redirect a user to a supported version of lpadder for a old project) + Changelogs button for new versions.
  - [ ] Auto-increment versions
  - [ ] Development on branch `develop` and leave `main` branch for commits to production only (when a new version releases).

### App Structure
- [ ] Think about a way to store projects (structure of the `.zip`).
  - [ ] Add `assets` key to interface that will contain nor the path of the asset (in zipped cover.json) nor the Uint8Array of the asset (in localForage when parsed).
  - [x] Think how I can implement the pages and samples (+ multi-launchpad support).
    - A sample can maybe look like this `{ padId: number, onPadDown: ActionTrigger | null, onPadUp: ActionTrigger | null }`
    - ActionTrigger interface can look like this: `{ audio: any (?), midi: any (?) }`.
    - **This is just brainstorm** to know how it can be good and the most optimized to run smoothly.
- [x] Support project imports/exports.
  - [x] Can export through menu (share->Export to .zip)
  - [x] Can import a cover through 'import' button
    - [x] Can read the zip content imported
    - [x] Can get content of cover.json + check if file exists
    - [x] Show a modal to choose a slug to save the cover in localForage.

### Design
- [x] Responsive menus for `/projects`. 
- [x] Launchpad component is "responsive" (using full width and aspect ratio 1/1 on pads).
- [ ] Utilities page
  - [x] Think how the pages will be displayed
  - [x] Code-splitting on every utilities routes (to reduce bundle size and then better performances)
  - [ ] Design the current utilities

## Explaining the lpadder project structure

Each covers is bundled into a `.zip` file that contains a single `cover.json` file.
This file contains the project's global configuration and data.

You can see its interface (`ProjectStructure`) in the [`Project.ts`](./src/types/Project.ts) file.

## Contribute

### Development

This app was made using [Vite](https://vitejs.dev), [React](https://reactjs.org) and [TypeScript](https://www.typescriptlang.org). Deployment is made with [Vercel](https://vercel.com).

- `yarn dev`: Starts the Vite development server on port 3000.
  - Note: if you use a reverse proxy to access the development server, you'll need to create a `.env.local` file based on `.env.sample` and modify `CLIENT_PORT` from `3000` to the port you're using in your reverse proxy. This will make Vite HMR work.
- `yarn build`: Builds the app into `dist` directory.
- `yarn serve`: Serves the builded app under `dist`.
- `yarn lint`: Only runs `eslint`. Useful when used with `--fix`.
- `yarn run check`: Runs `eslint` and `tsc` to check for errors.
- `yarn release`: Runs `yarn check`, bumps the `version` in `package.json`, commits the changes to `main` branch, tags the release and create a GitHub Release. The release will trigger a GitHub Action that would run a Vercel build. On successful deploy, it will updatethe GitHub Release to point to the newly deployed URL.

### Launchpad resources

- Launchpad Pro MK3: [Programmer Documentation](https://fael-downloads-prod.focusrite.com/customer/prod/s3fs-public/downloads/LPP3_prog_ref_guide_200415.pdf)
  - Used to determine layouts (`live` and `programmer`) and pads ID.

### Thanks you for reading !

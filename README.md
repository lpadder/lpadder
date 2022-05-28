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

### App Structure
- [x] Think about a way to store projects (structure of the `.zip`).
  - [x] Add `assets` key to interface that will contain nor the path of the asset (in zipped cover.json) nor the Uint8Array of the asset (in localForage when parsed).
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
- [ ] Metadata for samples (how to create them ?)
  - I think to use wavesurfer, so maybe I need to dig in before starting to think about samples interface.
- [ ] Make everything editable
  - [ ] Add inputs and selects for launchpads and pages.
  - [ ] Add audio imports and MIDI/JSON imports.
  - [ ] Create a timeline (using wavesurfer)

### Design
- [ ] Responsive launchpads on projects.
- [x] Responsive menus for `/projects`. 
- [x] Launchpad component is "responsive" (using full width and aspect ratio 1/1 on pads).
- [x] Utilities page
  - [x] Think how the pages will be displayed
  - [x] Code-splitting on every utilities routes (to reduce bundle size and then better performances)
  - [x] Design the utilities

## Explaining the lpadder project structure

Each covers is bundled into a `.zip` file that contains a single `cover.json` file.
This file contains the project's global configuration and data.

You can see its interface (`ProjectStructure`) in the [`Project.ts`](./src/types/Project.ts) file.

## Contribute

### Development

This app was made using [Vite](https://vitejs.dev), [SolidJS](https://solidjs.com) and [TypeScript](https://www.typescriptlang.org). Deployment is powered with [Vercel](https://vercel.com).

- `pnpm dev`: Starts the Vite development server on port 3000.
  - Note: if you use a reverse proxy to access the development server, you'll need to create a `.env.local` file based on `.env.sample` and modify `CLIENT_PORT` from `3000` to the port you're using in your reverse proxy. This will make Vite HMR work.
- `pnpm build`: Builds the app into `dist` directory.
- `pnpm serve`: Serves the builded app under `dist`.
- `pnpm lint`: Only runs `eslint`. You can fix errors by running `pnpm lint --fix`.
- `pnpm check`: Runs `eslint` and `tsc` to check for errors.
- `pnpm release`: Runs `pnpm check`, bumps the `version` in `package.json`, commits the changes and tag, then creates a GitHub Release.
  - Note: the published GitHub release will trigger a GitHub Action that will run a Vercel build. On successful deploy, it will update the published GitHub Release and append `Deployment URL: <VERCEL_DEPLOY_URL>\n\n` at the top of the release body.

## Resources used

I used these documentations to determine how `live` and `programmer` layouts were made.
- Launchpad Pro MK2: [Programmer Documentation](https://d2xhy469pqj8rc.cloudfront.net/sites/default/files/novation/downloads/10598/launchpad-pro-programmers-reference-guide_0.pdf)
- Launchpad Pro MK3: [Programmer Documentation](https://fael-downloads-prod.focusrite.com/customer/prod/s3fs-public/downloads/LPP3_prog_ref_guide_200415.pdf)

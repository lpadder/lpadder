# lpadder: Play Launchpad covers directly from your browser.

![GitHub - Social Banner](https://user-images.githubusercontent.com/59152884/149331485-5665c855-29ad-4205-9c90-3e632f1e7bef.png)

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
- [ ] Think about a way to store projects (structure of the `.zip`).
  - [ ] Add `assets` key to interface that will contain nor the path of the asset (in zipped cover.json) nor the Uint8Array of the asset (in localForage when parsed).
  - [ ] Think how I can implement the pages and samples (+ multi-launchpad support).
    - It surely need a new key: `launchpads`. (to do: launchpad-0, launchpad-1 => multi-launchpad).
    - The value will be an array of pages (so another array but now of objects)
    - A page can look like this: `{ name: string, samples: [...] }`.
    - A sample can maybe look like this `{ padId: number, onPadDown: ActionTrigger | null, onPadUp: ActionTrigger | null }`
    - ActionTrigger interface can look like this: `{ audio: any (?), midi: any (?) }`.
    - **This is just brainstorm** to know how it can be good and the most optimized to run smoothly.
- [ ] Support project imports/exports.
  - [x] Can export through menu (share->Export to .zip)
  - [ ] Can import a cover through 'import' button
    - [x] Can read the zip content imported
    - [x] Can get content of cover.json + check if file exists
    - [ ] Show a modal to choose a slug to save the cover in localForage.

### Design
- [x] Responsive menus for `/projects`. 
- [x] Launchpad component is "responsive" (using full width and aspect ratio 1/1 on pads).
- [ ] Utilities page
  - [ ] Think how the pages will be displayed
  - [x] Code-splitting on every utilities routes (to reduce bundle size and then better performances)

## Explaining the lpadder project structure

Each covers is bundled into a `.zip` file that contains a single `cover.json` file.
This file contains the project's global configuration and data.

### Interface `cover.json`

```typescript
{
  name: string;
  authors: string[];

  /** Launchpadders that made the cover */
  launchpadders: string[];

  /** Launchpads used in the cover */
  launchpads: ({
    name: string;
    samples: {
      /** Note: 'padId' will always match with Programmer layout only ! */
      padId: number;
      // More in coming...
    }[]; // Samples in the page.
  }[]) // Pages in a launchpad.
  []; // Launchpads array.
}
```

## Contribute

### Development

This app was made using [Vite](https://vitejs.dev), [React](https://reactjs.org) and [TypeScript](https://www.typescriptlang.org) and deployed with [Vercel](https://vercel.com).

- `yarn dev`: Starts the Vite development server on port 3000.
  - Note: if you use a reverse proxy to access the development server, you'll need to create a `.env.local` file and append `CLIENT_PORT=443` where `443` is the port you use in your reverse proxy. This will make the HMR work.
- `yarn build`: Builds the app into `dist` directory.
- `yarn serve`: Serves the builded app under `dist`.

### Launchpad resources

- Launchpad Pro MK3: [Programmer Documentation](https://fael-downloads-prod.focusrite.com/customer/prod/s3fs-public/downloads/LPP3_prog_ref_guide_200415.pdf)
  - Used to determine layouts (`live` and `programmer`) and pads ID.

### Thanks you for reading !

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
- [ ] Support project imports.

### Design
- [x] Responsive menus for `/projects`. 

## Explaining the lpadder project structure

Each covers is bundled into a `.zip` file that contains a single `cover.json` file.
This file is the project's configuration.

### Interface `cover.json`

```typescript
{
  name: string;
  authors: string[];

  /** Launchpadders that made the cover */
  launchpadders: string[];
}
```

## Contribute

### Development

This app is boostrapped by Vite, its PWA plugin,
React and TypeScript.

- `yarn dev`: Starts the Vite development server (on path `/absproxy/3000`).
- `yarn build`: Builds the app into `dist` directory.
- `yarn serve`: Serves the builded app under `dist`.

### Thanks you for reading !

# lpadder: Play Launchpad covers in your browser !

<img align="right" src="https://raw.githubusercontent.com/Vexcited/lpadder/main/public/icon-default.png" />

> Still in development ! (Really in development, I mean, there's no UI actually, it's juste basic HTML...)

`lpadder` (pronounced `el padder` or `launchpadder`) is a web application that
lets you play Launchpad covers directly from your browser.

It feature project editing, playing, saving current project ...
It also have some utilities like an Ableton parser
that will give you more informations about an Ableton
launchpad project. (In the future, we wish to be able to
convert Ableton projects to Unipad projects or lpadder projects).

## Things TODO

There's lists of what I need to work on to make this app better !
It can also help the contributors to know what they can work on.

### App Structure
- [ ] Think about a way to store projects (structure of the .zip).
- [ ] Import projects support.

### Design
- [x] Responsive menus for `/projects`. 

## Contribute

### Development

This app is boostrapped by Vite, its PWA plugin,
React and TypeScript.

- `yarn dev`: Starts the Vite development server (on path `/absproxy/3000`).
- `yarn build`: Builds the app into `dist` directory.
- `yarn serve`: Serves the builded app under `dist`.

### Contributions are welcome !

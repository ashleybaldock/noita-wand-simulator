## Branches

- `master` is deployed to: https://tinker-with-wands-online.vercel.app/
- `develop` is deployed to: (tbd - for now, master is develop in this fork)

## Tech

Uses: pnpm (formerly yarn), rollup (formerly CRA/webpack), vite (formerly CRA), React, redux
Host: Vercel

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm test`

Note: Test suite is currently not up to date.
Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Automatic code generation

These scripts convert the Lua files the game uses (for spells, and wand mechanics) into TypeScript. You need to supply the following from an installed copy of the game:

From the main game files:

```
data_base/translations/common.csv
```

From the modding data export (see [these instructions](https://noita.wiki.gg/wiki/Modding#Extracting_data_files)):

```
data/scripts/gun/gun_actions.lua
```

If versions of these files containing the 'beta' suffix are found, the additional spells are included behind a 'beta content' toggle in the sim. E.g.:

```
data_base/translations/common.beta.csv
data/scripts/gun/gun_actions.beta.lua
```

Get a diff of release and beta with:

```
diff --suppress-common-lines -trb gun_actions.ts gun_actions.beta.ts
diff --suppress-common-lines -trb -I 'spawn_' gun_actions.ts gun_actions.beta.ts
```

With those files in place, you can run this command to generate the Typescript files:

```
pnpm generate
```

That runs the following commands, which can also be run individually:

```
pnpm generate-actions
```

(Spell definitions) - uses: 'data/scripts/gun/gun_actions.lua'; runs: `scripts/generate_gun_actions.py`

```
pnpm generate-entity-map
```

(Spell definitions) - uses: 'data/scripts/gun/gun_actions.lua'; runs: `scripts/generate_entity_map.py`

```
pnpm generate-translations
```

(JSON translation for in-game strings) - uses: 'data_base/translations/common.csv'; runs: `scripts/generate_translations.py`

```
pnpm fetch-wiki
```

(JSON file containing exported data from the Noita wiki - used for spell tooltips etc.)

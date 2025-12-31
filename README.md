## Branches

- `master` is deployed to: https://tinker-with-wands-online.vercel.app/
- `develop` is deployed to: (tbd - for now, master is develop in this fork)

## Tech

pnpm, React, Redux
Host: Vercel
Todo: webpack→rollup, CRA→vite

## Available Scripts

In the project directory, you can run:

#### `pnpm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `pnpm test`

Note: Test suite is currently not up to date.
Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `pnpm build`

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

With those files in place, you can run these commands to generate the Typescript files:

#### `pnpm generate-actions`

Converts spell definitions in lua to TypeScript
- in: `./data/scripts/gun/gun_actions.lua`
- script: `./scripts/generate_gun_actions.py`
- out:
 - `src/app/calc/__generated__/main/actionIds.ts`
 - `src/app/calc/__generated__/main/spells.ts`
 - `src/app/calc/__generated__/main/unlocks.ts`
 - `src/app/calc/__generated__/main/spellSprites.ts`
 - `src/app/calc/__generated__/main/extraEntities.ts`

#### `pnpm generate-entity-map`

Generates Types for various game entities

- script: `./scripts/generate_entity_map.py`
- in: `./data/scripts/gun/gun_actions.lua`
- out:
 - `./src/app/calc/__generated__/main/entityMap.ts`
 - `./src/app/calc/__generated__/main/projectileIds.ts`

#### `pnpm generate-translations`

Generates files containing translations for in-game strings

- script: `scripts/generate_translations.py`
- in: `data_base/translations/common.csv`
- out: `./src/app/calc/__generated__/i18n/translation-XX.ts`

#### `pnpm fetch-wiki`

Downloads a JSON file containing exported data from the Noita wiki - used for spell tooltips etc.

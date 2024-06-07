const fsPromises = require('fs/promises');
const Jimp = require('jimp');
const path = require('path');

const prefix = 'sprite-cursor';
const inputs = [
  {
    file: 'images/cursors-line-13x28.png',
    w: 13,
    h: 28,
    or: 'h',
    names: [
      'caret-line',
      'caret-hint-line',
      'spell-over-line',
      'select-over-line',
    ],
  },
  {
    file: 'images/cursors-middle-left-and-right-13x7.png',
    w: 13,
    h: 7,
    or: 'v',
    names: [
      'caret-arrow-mid-toright',
      'caret-arrow-mid-toleft',
      'caret-select-mid-toright',
      'caret-select-mid-toleft',
      'caret-select-mid-toleftandright',
      'caret-select-mid-fromright',
      'caret-select-mid-fromleft',
      'caret-select-mid-fromleftandright',
      'caret-select-mid-fromlefttoright',
      'caret-select-mid-fromrighttoleft',
      'caret-spell-mid-toright',
      'caret-spell-mid-toleft',
      'caret-spell-mid-toleftandright',
      'caret-spell-mid-fromright',
      'caret-spell-mid-fromleft',
      'caret-spell-mid-fromleftandright',
    ],
  },
  {
    file: 'images/cursors-top-and-bottom-13x7.png',
    w: 13,
    h: 7,
    or: 'v',
    names: [
      'caret-bottom',
      'caret-top',
      'caret-bottom-2',
      'caret-top-2',
      'caret-hint-bottom',
      'caret-hint-top',
      'caret-hint-top-toright',
      'caret-hint-top-toleft',
      'caret-hint-bottom-toright',
      'caret-hint-bottom-toleft',
      'caret-arrow-top-toright',
      'caret-arrow-top-toleft',
      'caret-arrow-bottom-toright',
      'caret-arrow-bottom-toleft',
      'caret-select-bottom',
      'caret-select-top',
      'caret-select-start-bottom',
      'caret-select-start-top',
      'caret-select-end-bottom',
      'caret-select-end-top',
      'caret-spell-bottom',
      'caret-spell-top',
      'caret-spell-drophint-bottom',
      'caret-spell-drophint-top',
    ],
  },
];

const outfileCSS = 'src/app/calc/__generated__/main/sprites.css';
const outfileTS = 'src/app/calc/__generated__/main/sprites.ts';

fsPromises.writeFile(
  path.join(process.cwd(), outfileTS),
  `/* Auto-generated file */

export const sprites = [
  ${inputs.flatMap(({ names }) =>
    names.flatMap((name) => `'var(--${prefix}-${name})',`),
  ).join(`
  `)}
] as const;

export type Sprite = typeof sprites[number];`,
);

Promise.all(
  inputs.flatMap(({ file, w, h, or, names }) =>
    Jimp.read(path.join(process.cwd(), file)).then((image) =>
      Promise.all(
        names.flatMap((name, i) => {
          const x = or === 'v' ? 0 : i * w;
          const y = or === 'h' ? 0 : i * h;
          const clone = image.clone();
          clone.crop(x, y, w, h);
          return clone
            .getBase64Async(Jimp.MIME_PNG)
            .then((b64img) => `--${prefix}-${name}: url('${b64img}');`);
        }),
      ),
    ),
  ),
).then((cssSprites) =>
  fsPromises.writeFile(
    path.join(process.cwd(), outfileCSS),
    `:root {
  ${cssSprites.flat().join(`

  `)}
}`,
  ),
);

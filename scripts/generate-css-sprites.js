const fsPromises = require('fs/promises');
const Jimp = require('jimp');
const path = require('path');

const inputs = [
  {
    file: 'images/cursors-line-13x28.png',
    w: 13,
    h: 28,
    or: 'h',
    names: [
      'caret-line',
      'caret-hover-line',
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
      'spell-middle-toright',
      'spell-middle-toleft',
      'spell-middle-leftright',
      'spell-middle-fromright',
      'spell-middle-fromleft',
      'select-middle-toright',
      'select-middle-toleft',
      'select-middle-leftright',
      'select-middle-fromright',
      'select-middle-fromleft',
    ],
  },
  {
    file: 'images/cursors-top-and-bottom-13x7.png',
    w: 13,
    h: 7,
    or: 'v',
    names: [
      'caret-top',
      'caret-hint-top-none',
      'caret-hint-top-toleft',
      'caret-hint-top-toright',
      'caret-hover-top-toright',
      'caret-hover-top-toleft',
      'caret-hover-top',
      'caret-hover-bottom',
      'select-over-top',
      'select-over-bottom',
      'select-end-top',
      'select-end-bottom',
      'select-start-top',
      'select-start-bottom',
      'spell-over-top',
      'spell-over-bottom',
    ],
  },
];

const outfile = 'src/app/calc/__generated__/main/sprites.css';

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
            .then((b64img) => `--sprite-cursor-${name}: url('${b64img}');`);
        }),
      ),
    ),
  ),
).then((cssSprites) =>
  fsPromises.writeFile(
    path.join(process.cwd(), outfile),
    `:root {
  ${cssSprites.flat().join(`

  `)}
}`,
  ),
);

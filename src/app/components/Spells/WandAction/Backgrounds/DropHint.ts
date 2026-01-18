import type { Background } from './BackgroundPart';
import { emptyBackground } from './BackgroundPart';

export const dropHints = [
  'none',
  'forbidden',
  'swap',
  'replace',
  'shiftleft',
  'shiftright',
  'dragging',
] as const;

export type DropHint = (typeof dropHints)[number];

// `${type}.${dragging}.${isOver}.${canDrop}.${hint}`;

export const dropHintBackgrounds: Record<DropHint, Background> = {
  none: emptyBackground(),
  dragging: {
    ...emptyBackground(),
    before: {
      backgroundImage: [`var(--sprite-cursor-caret-spell-drophint-top)`],
      backgroundRepeat: [`no-repeat`],
      backgroundSize: [`var(--cursor-container-width)`],
      backgroundPosition: [`center top`],
      cursor: [''],
    },
    on: {
      backgroundImage: [`var(--sprite-cursor-caret-spell-drophint-top)`],
      backgroundRepeat: [`no-repeat`],
      backgroundSize: [`var(--cursor-container-width)`],
      backgroundPosition: [`center top`],
      cursor: [''],
    },
    after: {
      backgroundImage: [`var(--sprite-cursor-caret-spell-drophint-top)`],
      backgroundRepeat: [`no-repeat`],
      backgroundSize: [`var(--cursor-container-width)`],
      backgroundPosition: [`center top`],
      cursor: [''],
    },
  },
  forbidden: { ...emptyBackground() },
  swap: { ...emptyBackground() },
  replace: { ...emptyBackground() },
  shiftleft: {
    ...emptyBackground(),
    before: {
      backgroundImage: [
        `var(--sprite-cursor-caret-arrow-top-toleft)`,
        `var(--sprite-cursor-caret-arrow-bottom-toleft)`,
        `var(--sprite-cursor-caret-spell-over-line)`,
        `var(--sprite-cursor-caret-spell-mid-toleft)`,
      ],
      backgroundRepeat: [`no-repeat`, `no-repeat`, `repeat-y`, `no-repeat`],
      backgroundSize: [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      backgroundPosition: [
        `center top`,
        `center bottom`,
        `center center`,
        `left center`,
      ],
      cursor: ['w-resize'],
    },
  },
  shiftright: {
    ...emptyBackground(),
    before: {
      backgroundImage: [
        `var(--sprite-cursor-caret-arrow-top-toright)`,
        `var(--sprite-cursor-caret-arrow-bottom-toright)`,
        `var(--sprite-cursor-caret-spell-over-line)`,
        `var(--sprite-cursor-caret-spell-mid-toright)`,
      ],
      backgroundRepeat: [`no-repeat`, `no-repeat`, `repeat-y`, `no-repeat`],
      backgroundSize: [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      backgroundPosition: [
        `center top`,
        `center bottom`,
        `center center`,
        `right center`,
      ],
      cursor: ['e-resize'],
    },
  },
};

export const selectHintBackgrounds: Record<DropHint, Background> = {
  none: emptyBackground(),
  swap: { ...emptyBackground() },
  replace: { ...emptyBackground() },
  dragging: { ...emptyBackground() },
  forbidden: {
    ...emptyBackground(),
  },
  shiftleft: {
    ...emptyBackground(),
    before: {
      backgroundImage: ['var(--sprite-cursor-caret-select-mid-toleft)'],
      backgroundRepeat: [`no-repeat`],
      backgroundSize: [`var(--cursor-container-width)`],
      backgroundPosition: [`center`],
      cursor: [],
    },
    after: {
      backgroundImage: ['var(--sprite-cursor-caret-select-mid-toleft)'],
      backgroundRepeat: [`no-repeat`],
      backgroundSize: [`var(--cursor-container-width)`],
      backgroundPosition: [`center`],
      cursor: [],
    },
  },
  shiftright: {
    ...emptyBackground(),
    after: {
      backgroundImage: ['var(--sprite-cursor-caret-select-mid-toright)'],
      backgroundRepeat: [`no-repeat`],
      backgroundSize: [`var(--cursor-container-width)`],
      backgroundPosition: [`center`],
      cursor: [],
    },
  },
};

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
  none: { ...emptyBackground() },
  dragging: {
    ...emptyBackground(),
    before: {
      'background-image': [`var(--sprite-cursor-caret-spell-drophint-top)`],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center top`],
      'cursor': [''],
    },
    on: {
      'background-image': [`var(--sprite-cursor-caret-spell-drophint-top)`],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center top`],
      'cursor': [''],
    },
    after: {
      'background-image': [`var(--sprite-cursor-caret-spell-drophint-top)`],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center top`],
      'cursor': [''],
    },
  },
  forbidden: { ...emptyBackground() },
  swap: { ...emptyBackground() },
  replace: { ...emptyBackground() },
  shiftleft: {
    ...emptyBackground(),
    before: {
      'background-image': [
        `var(--sprite-cursor-caret-spell-top)`,
        `var(--sprite-cursor-caret-spell-bottom)`,
        `var(--sprite-cursor-caret-spell-over-line)`,
        `var(--sprite-cursor-caret-spell-mid-toleft)`,
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`, `no-repeat`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [
        `center top`,
        `center bottom`,
        `center center`,
        `center`,
      ],
      'cursor': ['w-resize'],
    },
  },
  shiftright: {
    ...emptyBackground(),
    before: {
      'background-image': [
        `var(--sprite-cursor-caret-spell-top)`,
        `var(--sprite-cursor-caret-spell-bottom)`,
        `var(--sprite-cursor-caret-spell-over-line)`,
        `var(--sprite-cursor-caret-spell-mid-toright)`,
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`, `no-repeat`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [
        `center top`,
        `center bottom`,
        `center center`,
        `center`,
      ],
      'cursor': ['e-resize'],
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
      'background-image': ['var(--sprite-cursor-caret-select-mid-toleft)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center`],
      'cursor': [],
    },
    after: {
      'background-image': ['var(--sprite-cursor-caret-select-mid-toleft)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center`],
      'cursor': [],
    },
  },
  shiftright: {
    ...emptyBackground(),
    after: {
      'background-image': ['var(--sprite-cursor-caret-select-mid-toright)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center`],
      'cursor': [],
    },
  },
};

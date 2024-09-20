import type { Background } from './BackgroundPart';
import { emptyBackground } from './BackgroundPart';

export const caretStyles = [
  'none',
  'caret-hover',
  'caret',
  'caret-select',
  'spell-over',
] as const;

export type CaretStyle = (typeof caretStyles)[number];

export type CaretPosition = 'none' | 'before' | 'after';

export type Caret = {
  before: CaretStyle;
  after: CaretStyle;
};

export const defaultCaret: Caret = { before: 'none', after: 'none' };

export const caretBackgrounds: Record<CaretStyle, Background> = {
  none: { ...emptyBackground() },
  'caret-hover': {
    ...emptyBackground(),
    before: {
      'background-image': [
        `var(--sprite-cursor-caret-hint-top)`,
        `var(--sprite-cursor-caret-hint-bottom)`,
        `var(--sprite-cursor-caret-hint-line)`,
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      cursor: ['text'],
    },
  },
  caret: {
    ...emptyBackground(),
    before: {
      'background-image': [
        `var(--sprite-cursor-caret-top)`,
        `var(--sprite-cursor-caret-line)`,
      ],
      'background-repeat': [`no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center center`],
      cursor: ['text'],
    },
  },
  'spell-over': {
    ...emptyBackground(),
    before: {
      'background-image': [
        `var(--sprite-cursor-caret-spell-top)`,
        `var(--sprite-cursor-caret-spell-bottom)`,
        `var(--sprite-cursor-caret-spell-over-line)`,
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      cursor: [''],
    },
  },
  'caret-select': {
    ...emptyBackground(),
    before: {
      'background-image': [
        `var(--sprite-cursor-carat-select-top)`,
        `var(--sprite-cursor-carat-select-bottom)`,
        `var(--sprite-cursor-select-over-line)`,
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      cursor: ['text'],
    },
  },
};

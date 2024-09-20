import type { WandSelection } from '../../../../redux/Wand/wandSelection';
import type { Background } from './BackgroundPart';
import { emptyBackground } from './BackgroundPart';

export const selectionBackgrounds: Record<WandSelection, Background> = {
  none: { ...emptyBackground() },
  start: {
    ...emptyBackground(),
    before: {
      'background-image': [
        'var(--sprite-cursor-caret-select-start-top)',
        'var(--sprite-cursor-caret-select-start-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      cursor: ['w-resize'],
    },
  },
  thru: { ...emptyBackground() },
  end: {
    ...emptyBackground(),
    after: {
      'background-image': [
        'var(--sprite-cursor-caret-select-end-top)',
        'var(--sprite-cursor-caret-select-end-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      cursor: ['e-resize'],
    },
  },
  single: {
    ...emptyBackground(),
    before: {
      'background-image': [
        'var(--sprite-cursor-caret-select-start-top)',
        'var(--sprite-cursor-caret-select-start-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      cursor: ['w-resize'],
    },
    after: {
      'background-image': [
        'var(--sprite-cursor-caret-select-end-top)',
        'var(--sprite-cursor-caret-select-end-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      cursor: ['e-resize'],
    },
  },
};

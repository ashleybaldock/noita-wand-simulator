import type { WandSelection } from '../../../../redux/Wand/wandSelection';
import type { Background } from './BackgroundPart';
import { emptyBackground } from './BackgroundPart';

export const selectionBackgrounds: Record<WandSelection, Background> = {
  none: { ...emptyBackground() },
  start: {
    ...emptyBackground(),
    before: {
      backgroundImage: [
        'var(--sprite-cursor-caret-select-start-top)',
        'var(--sprite-cursor-caret-select-start-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      backgroundRepeat: [`no-repeat`, `no-repeat`, `repeat-y`],
      backgroundSize: [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      backgroundPosition: [`center top`, `center bottom`, `center center`],
      cursor: ['w-resize'],
    },
  },
  thru: { ...emptyBackground() },
  end: {
    ...emptyBackground(),
    after: {
      backgroundImage: [
        'var(--sprite-cursor-caret-select-end-top)',
        'var(--sprite-cursor-caret-select-end-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      backgroundRepeat: [`no-repeat`, `no-repeat`, `repeat-y`],
      backgroundSize: [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      backgroundPosition: [`center top`, `center bottom`, `center center`],
      cursor: ['e-resize'],
    },
  },
  single: {
    ...emptyBackground(),
    before: {
      backgroundImage: [
        'var(--sprite-cursor-caret-select-start-top)',
        'var(--sprite-cursor-caret-select-start-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      backgroundRepeat: [`no-repeat`, `no-repeat`, `repeat-y`],
      backgroundSize: [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      backgroundPosition: [`center top`, `center bottom`, `center center`],
      cursor: ['w-resize'],
    },
    after: {
      backgroundImage: [
        'var(--sprite-cursor-caret-select-end-top)',
        'var(--sprite-cursor-caret-select-end-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      backgroundRepeat: [`no-repeat`, `no-repeat`, `repeat-y`],
      backgroundSize: [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      backgroundPosition: [`center top`, `center bottom`, `center center`],
      cursor: ['e-resize'],
    },
  },
};

import { createGlobalStyle } from 'styled-components';
import { DEFAULT_SIZE, NESTING_OFFSET } from './util';

/* see also index.css
 * --[flags][category]-[area]-[css-property]
 * --[u]size-spell-margin-right
 *
 *  --usize-: unit length (1x multiplier)
 *  --bsize-: base size
 * --bxsize-: base size multiplier
 *   --size-: override size
 *  --xsize-: size multiplier
 * */
export const GlobalStyle = createGlobalStyle<{ keyHints: boolean }>`
  :root {
    --usize-spell: 1px;
    --bsize-spell: ${DEFAULT_SIZE}px;
    --bxsize-spell-border: 0.0625;
    --bsize-spell-padding: calc(var(--bsize-spell) * var(--bxsize-spell-border));
    --bsize-spell-border-width: calc(var(--bsize-spell) * var(--bxsize-spell-border));

    --sizes-spelledit-spell-total: calc(var(--bsize-spell) + (var(--bsize-spell-border-width) * 2));
    --sizes-spelledit-grid-layout-gap: 8px;

    --sizes-before-droptarget-width: 30px;
    --sizes-after-droptarget-width: 30px;

    --sizes-nesting-offset: ${NESTING_OFFSET}px;

    ${({ keyHints }) =>
      keyHints ? '--display-keyhints: flex;' : '--display-keyhints: none;'}
  }
  @media screen and (max-width: 800px) {
    :root {
      --display-keyhints: none;
    }
  }
`;

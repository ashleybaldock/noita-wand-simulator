import { createGlobalStyle } from 'styled-components';
import { DEFAULT_SIZE } from './util';

/* see also index.css */
export const GlobalStyle = createGlobalStyle`
  :root {
    --sizes-spell-base: ${DEFAULT_SIZE}px;
  }
`;

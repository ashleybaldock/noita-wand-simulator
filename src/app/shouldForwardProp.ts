import isPropValid from '@emotion/is-prop-valid';
import { isString } from './util';
import type { StyledTarget } from 'styled-components/dist/types';

export const shouldForwardProp = (
  propName: string,
  target: StyledTarget<'web'>,
) => !isString(target) || isPropValid(propName);

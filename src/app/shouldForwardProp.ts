import isPropValid from '@emotion/is-prop-valid';
import { isString } from './util';
import { StyledTarget } from 'styled-components/dist/types';

// export function shouldForwardProp(propName:string, target: StyledTarget<'web'>) {
//   if (typeof target === "string") {
//     return isPropValid(propName);
//   }
//   return true;
// }
export const shouldForwardProp = (
  propName: string,
  target: StyledTarget<'web'>,
) => !isString(target) || isPropValid(propName);

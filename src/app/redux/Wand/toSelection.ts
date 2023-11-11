import { WandSelection } from '../../types';

export const getSelectionForId = (
  idx: number,
  from: number | null,
  to: number | null,
): WandSelection => {
  if (from === null || to === null) {
    return 'none';
  }
  if (from === to && from === idx) {
    return 'single';
  }
  if ((idx >= from && idx <= to) || (idx >= to && idx <= from)) {
    if (idx === from) {
      return 'start';
    }
    if (idx === to) {
      return 'end';
    }
    return 'thru';
  }
  return 'none';
};

import type { WandSelectionSet } from './wandSelection';

export const getSelectionForId = (
  idx: number,
  from: number | null,
  to: number | null,
): WandSelectionSet => {
  if (from === null || to === null) {
    return { before: 'none', on: 'none', after: 'none' };
  }
  if (from === to) {
    if (from === idx) {
      return { before: 'start', on: 'single', after: 'end' };
    } else {
      return { before: 'none', on: 'none', after: 'none' };
    }
  }

  const [a, b] = [Math.min(from, to), Math.max(from, to)];
  if (idx < a && idx < b) {
    return { before: 'none', on: 'none', after: 'none' };
  }
  if (idx === a && idx < b) {
    return { before: 'start', on: 'thru', after: 'thru' };
  }
  if (idx > a && idx < b) {
    return { before: 'thru', on: 'thru', after: 'thru' };
  }
  if (idx > a && idx === b) {
    return { before: 'thru', on: 'thru', after: 'end' };
  }
  if (idx > a && idx > b) {
    return { before: 'none', on: 'none', after: 'none' };
  }
  return { before: 'none', on: 'none', after: 'none' };
};

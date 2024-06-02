import { emptyBackgroundPart, type BackgroundPart } from './BackgroundPart';

export const dropHints = [
  'none',
  'forbidden',
  'swap',
  'replace',
  'shiftleft',
  'shiftright',
] as const;

export type DropHint = (typeof dropHints)[number];

export type DropHintBackgroundParts = Record<DropHint, BackgroundPart>;

export type DropHints = {
  none: BackgroundPart;
  dragging: DropHintBackgroundParts;
  over: DropHintBackgroundParts;
  overCanDrop: DropHintBackgroundParts;
};

export const emptyDropHintParts = {
  none: emptyBackgroundPart,
  forbidden: emptyBackgroundPart,
  swap: emptyBackgroundPart,
  replace: emptyBackgroundPart,
  shiftleft: emptyBackgroundPart,
  shiftright: emptyBackgroundPart,
};
// `${type}.${dragging}.${isOver}.${canDrop}.${hint}`;

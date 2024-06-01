import type { BackgroundPart } from './BackgroundPart';

export const dropHints = [
  'none',
  'forbidden',
  'swap',
  'replace',
  'shiftleft',
  'shiftright',
] as const;

export type DropHint = (typeof dropHints)[number];

export type DropHints = {
  none: BackgroundPart;
  dragging: Record<DropHint, BackgroundPart>;
  over: Record<DropHint, BackgroundPart>;
  overCanDrop: Record<DropHint, BackgroundPart>;
};

// `${type}.${dragging}.${isOver}.${canDrop}.${hint}`;

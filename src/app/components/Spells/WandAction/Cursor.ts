export const cursorStyles = [
  'none',
  'caret-hover',
  'caret',
  'spell-over',
] as const;
export type CursorStyle = (typeof cursorStyles)[number];

export type CursorPosition = 'none' | 'before' | 'after';

export type Cursor = {
  position: CursorPosition;
  style: CursorStyle;
};

export const defaultCursor: Cursor = { position: 'none', style: 'none' };

export type CursorStyle = 'none' | 'caret';

export type CursorPosition = 'none' | 'before' | 'after';

export type Cursor = {
  position: CursorPosition;
  style: CursorStyle;
};

export const defaultCursor: Cursor = { position: 'none', style: 'none' };

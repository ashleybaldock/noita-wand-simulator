export type WandSelection = 'none' | 'start' | 'thru' | 'end' | 'single';

export type WandSelectionSet = {
  before: WandSelection;
  on: WandSelection;
  after: WandSelection;
};

export const defaultWandSelection: WandSelection = 'none';

export const defaultWandSelectionSet: WandSelectionSet = {
  before: defaultWandSelection,
  on: defaultWandSelection,
  after: defaultWandSelection,
};

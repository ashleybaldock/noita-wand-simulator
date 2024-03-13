export type SpellShiftDirection = 'left' | 'right' | 'none';
export type SpellEditMode = 'overwrite' | 'swap' | 'before' | 'after';
export type SelectionIndex = 'cursor' | number;

export type StopConditions = {
  shotCount: number;
  reloadCount: number;
  refreshCount: number;
  repeatCount: number;
  iterLimit: number;
  timeLimit: number;
};

export type StopCondition =
  | 'oneshot'
  | 'reload'
  | 'refresh'
  | 'iterLimit'
  | 'looped';

export type StopReason =
  | StopCondition
  | 'noSpells'
  | 'timeout'
  | 'exception'
  | 'unknown';

export const EditDirections = ['left', 'right'] as const;

export type EditDirection = (typeof EditDirections)[number];

export const InsertModes = ['shift', 'push', 'pull'] as const;

export type InsertMode = (typeof InsertModes)[number];

export const ReplaceModes = ['swap', 'overwrite'] as const;

export type ReplaceMode = (typeof ReplaceModes)[number];

export const OverflowStrategies = [
  'expand',
  'virtual',
  'forbid',
  'truncate',
] as const;

export type OverflowStrategy = (typeof OverflowStrategies)[number];

export const DeleteStrategies = ['blank', 'shift'] as const;

export type DeleteStrategy = (typeof DeleteStrategies)[number];

export const CursorMotions = ['fixed', 'follow'] as const;

export type CursorMotion = (typeof CursorMotions)[number];

/**
 * Current editing strategy, depending on config
 *  and the state of any modifier keys
 *
 *  ╭ insert: When a spell is dropped between others
 *  ∇
 *  ├╴shift<L/R>: Move all spells over to make room. (preserves gaps) ╶╶╶╮
 *  │                                                                    ¦
 *  ├─╴push<L/R>: Compress gaps starting from the insertion location. ╶╶╶╎
 *  ╰─╴pull<L/R>: Compress gaps starting from the end of the wand.    ╶╶╶¦
 *              (preserves spells)                                       ╎
 *                                                                       ¦
 *  ╭╴overflow: When inserting a spell exceeds wand capacity╶╴╴╴╴╴╴╴╴╴╴╴╴╯
 *  ∇
 *  ├───╴expand: grow wand capacity
 *  ├──╴virtual: wand capacity overflows into ghosts
 *  ├───╴forbid: don't permit insertion (only replacement)
 *  ╰─╴truncate: remove spells that overflow
 *
 *  ╭╴replace: Mode to use when a spell is dropped atop another
 *  ∇
 *  ├─────╴swap: Exchange position of the two spells (like in-game)
 *  │            (If replacement from inventory, acts like overwrite
 *  ╰╴overwrite: Overwrite target spell with source
 *               Use delete strategy for source spell ╶╶╶╮
 *                                                       ¦
 *  ╭ delete: When deleting a spell╶╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴─╯
 *  ∇
 *  ├──────╴blank: leave an empty spell slot
 *  ╰─╴shift<L/R>: shift the rest of the spells left/right to fill the gap
 *
 *  ╭╴cursor: When doing any of the previous things, should cursor stay
 *  ∇          fixed in place or move with the flow of the spells
 *  ├─╴fixed: Maintain same index position in wand
 *  ╰╴follow: Follow the movement of the spells in the wand
 */
export type EditMode = {
  direction: EditDirection;
  insert: InsertMode;
  replace: ReplaceMode | InsertMode;
  overflow: OverflowStrategy;
  delete: DeleteStrategy;
  cursor: CursorMotion;
};

const EditDirections = ['left', 'right'] as const;

export type EditDirection = (typeof EditDirections)[number];

const InsertModes = ['shift', 'push', 'pull'] as const;

export type InsertMode = (typeof InsertModes)[number];

const ReplaceModes = ['swap', 'replace'] as const;

export type ReplaceMode = (typeof ReplaceModes)[number];

const OverflowStrategies = ['expand', 'forbid', 'truncate'] as const;

export type OverflowStrategy = (typeof OverflowStrategies)[number];

const DeleteStrategies = ['blank', 'shiftleft', 'shiftright'] as const;

export type DeleteStrategy = (typeof DeleteStrategies)[number];

const CursorMotions = ['fixed', 'follow'] as const;

export type CursorMotion = (typeof CursorMotions)[number];

/**
 * Which editing mode is currently selected
 * This is determined by config (for defaults)
 * and the current state of any modifier keys
 *
 *  ⎧ insert: When a spell is dropped between others
 * ⎧⎩        (all have a left and right variant)
 * ∇
 * ├╴shift<LR>: Move all spells over to make room.
 * │           (Preserves gaps at the expense of the farthest spells)
 * ├─╴push<LR>: Compress gaps starting from the insertion location.
 * ╰─╴pull<LR>: Compress gaps starting from the end of the wand.
 *              (Compresses the wand, preserves as many spells as possible)
 *
 *   ⎧ replace: Mode to use when a spell is dropped atop another
 *  ⎧⎩
 *  ∇      swap: Exchange position of the two spells (like in-game)
 *  │           (If new spell is from inventory, acts like replace)
 *  ├──╴replace: Overwrite old spell with new one
 *  │           (No change in length/position of other spells)
 *  ├╴shift<LR>: Same as insert:shift<LR>
 *  ├─╴push<LR>: Same as insert:push<LR>
 *  ╰─╴pull<LR>: Same as insert:pull<LR>
 *
 *   ⎧   overflow: When inserting a spell exceeds wand capacity
 *  ⎧⎩
 *  ∇ ──╴expand: grow wand capacity
 *  ├──╴virtual: wand capacity overflows into ghosts
 *  ├───╴forbid: don't permit insertion (only replacement)
 *  ╰─╴truncate: remove spells that overflow
 *
 *  delete: When deleting a spell
 *
 *  cursor: When doing any of the previous things, should cursor stay
 *          fixed in place or move with the flow of the spells
 *    fixed: Maintain same index position in wand
 *   follow: Follow the movement of the spells in the wand
 */
export type EditMode = {
  direction: EditDirection;
  insert: InsertMode;
  replace: ReplaceMode | InsertMode;
  overflow: OverflowStrategy;
  delete: DeleteStrategy;
  cursor: CursorMotion;
};

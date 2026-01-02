import type { SpellId } from '../../redux/Wand/spellId';
import { isString } from '../../util';

export const tooltipIds = ['tooltip-spellinfo', 'tooltip-actionhint'] as const;

export type TooltipId = (typeof tooltipIds)[number];

const uiHintDefinition = [
  [
    'copyurl',
    {
      desc: 'Copies the current wand URL to the clipboard. Share this URL to share your wand build with others.',
    },
  ],
  [
    'copywiki',
    {
      desc: 'Copies the current wand to the clipboard, formatted as a Wand2 template. (Can be pasted directly into Wiki pages).',
    },
  ],
  [
    'copywikiseq',
    {
      desc: 'Copies the current wand to the clipboard, formatted as a SpellSequence template. (Can be pasted directly into Wiki pages).',
    },
  ],
  [
    'copywikiexample',
    {
      desc: 'Copies the current wand to the clipboard, formatted as an Example template wrapping a Wand template.  (Can be pasted directly into Wiki pages)',
    },
  ],
  [
    'copyxml',
    {
      desc: 'Copies the current wand to the clipboard in NXML format suitable for modding.',
    },
  ],
  [
    'undo',
    {
      desc: 'Undo the last change made in the wand editor.',
    },
  ],
  [
    'redo',
    {
      desc: 'Redo last change undone in the wand editor.',
    },
  ],
  [
    'clear',
    {
      desc: 'Remove all spells from the wand.',
    },
  ],
  [
    'reset',
    {
      desc: 'Reset the wand to the initial state when it was loaded.',
    },
  ],
  [
    'save',
    {
      desc: 'Save this wand. (Saved locally by your web browser).',
    },
  ],
  [
    'load',
    {
      desc: 'Pick from a selection of blank wand presets.',
    },
  ],
  [
    'config',
    {
      desc: 'Configure the simulator and editor.',
    },
  ],
  [
    'shuffle_deck_when_empty',
    {
      desc: '(Currently broken!) Randomises the order of spells for each Salvo.',
    },
  ],
  [
    'deck_capacity',
    {
      title: 'Capacity',
      desc: 'Typically wands are limited to between 1 and 26 slots, though very rarely they can spawn with more.',
    },
  ],
  [
    'actions_per_round',
    {
      title: 'Spells/Cast',
      desc: 'When fired the wand gathers (draws) enough spells to satisfy its Spells/Cast.',
    },
  ],
  [
    'cast_delay',
    {
      title: 'Cast Delay',
      unit: 'frames',
      desc: 'Wands fire Salvos in a repeating pattern. Each Salvo is made up of one or more Casts. A Cast is the combined effect of the Spell(s multicast together) that it is formed from. Each Cast is followed by one or more frames of Cast Delay.',
    },
  ],
  [
    'reload_time',
    {
      title: 'Recharge Time',
      unit: 'frames',
      desc: 'Wands fire Salvos in a repeating pattern. Each Salvo is made up of one or more Casts, and is followed by one or more frames of Recharge Time.',
    },
  ],
  [
    'mana_max',
    {
      title: 'Mana Max',
      unit: 'mana',
      desc: "The wand's mana storage capacity.",
    },
  ],
  [
    'mana_charge_speed',
    {
      title: 'Mana Regen',
      unit: 'mana/second',
      desc: 'Rate at which the wand refills its mana reserve.',
    },
  ],
  [
    'wand_spread',
    {
      title: 'Spread',
      unit: 'degrees',
      desc: 'Angle of arc over which the projectiles the wand spawns are randomly distributed.',
    },
  ],
  [
    'wand_speed',
    {
      title: 'Speed',
      unit: 'multiplier',
      desc: 'Wands have a hidden speed multiplier, used as the base multiplier that is adjusted by speed altering modifiers.',
    },
  ],
  // [
  //   '',
  //   {
  //     desc: '',
  //   },
  // ],
] as const;

export const tipKinds = ['spellinfo', 'uihint'] as const;

export type TipKind = (typeof tipKinds)[number];

export type SpellTip = {
  kind: 'spellinfo';
  spellId: SpellId;
};

export type UiHint = (typeof uiHintDefinition)[number][0];

type UiHintDef = {
  title?: string;
  unit?: string;
  desc: string;
};

const uiHintMap = new Map<UiHint, UiHintDef>(uiHintDefinition);

export interface UiHintTip {
  kind: 'uihint';
  id: UiHint;
}

export type Tip = UiHintTip;

export type TipPopupId = `tooltip-${TipKind}`;

export type TipAttributes = {
  'data-tooltip-id'?: TipPopupId;
  'data-tooltip-content'?: string;
};

export const tipToAttributes = (tip: Tip): TipAttributes => {
  if (tip.kind === 'uihint') {
    return {
      'data-tooltip-id': `tooltip-uihint`,
      'data-tooltip-content': tip.id,
    };
  }
  return {};
};

export const isUiHint = (s: unknown): s is UiHint =>
  isString(s) && (uiHintMap as Map<string, UiHintDef>).has(s);

export const getUiHintDescription = (id?: UiHint) =>
  isUiHint(id) ? (uiHintMap.get(id)?.desc ?? '') : '...';

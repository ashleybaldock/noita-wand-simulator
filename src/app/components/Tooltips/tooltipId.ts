import type { SpellId } from '../../redux/Wand/spellId';
import { isString } from '../../util';

const tooltipIds = ['tooltip-spellinfo', 'tooltip-actionhint'] as const;

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
] as const;

const tipKinds = ['spellinfo', 'uihint'] as const;

export type TipKind = (typeof tipKinds)[number];

export type SpellTip = {
  kind: 'spellinfo';
  spellId: SpellId;
};

export type UiHint = (typeof uiHintDefinition)[number][0];

type UiHintDef = {
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
  isUiHint(id) ? uiHintMap.get(id)?.desc ?? '' : '...';

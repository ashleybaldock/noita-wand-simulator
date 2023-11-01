import { SpellId, WandState } from '../../types';
import { toSeconds } from '../../util';

export type WikiWandOptions = {
  pretty: boolean;
  vertical: boolean;
  wandCard: boolean;
  hideLink: boolean;
  tooltips: boolean;
};

const defaultOptions: WikiWandOptions = {
  pretty: true,
  vertical: false,
  wandCard: false,
  hideLink: false,
  tooltips: true,
};

const formatBoolean = (bool: boolean): string => (bool ? 'Yes' : 'No');

// const formatSpellsSparse = (spellIds: SpellId[], indent: string = ''): string =>
//   spellIds.join(',\n${indent}');

const formatSpellsPretty = (spellIds: SpellId[], indent: string = ''): string =>
  spellIds.reduce<string>(
    (acc, cur) =>
      cur?.length ?? false ? `${acc},\n${indent}${cur}` : `${acc},`,
    '',
  );

// const formatSpellsDense = (spellIds: SpellId[]): string => spellIds.join(',');

const indent = '                 ';

export const generateWikiWandV2 = (
  {
    wand: {
      cast_delay,
      mana_max,
      mana_charge_speed,
      spread,
      name,
      pic,
      speed,
      actions_per_round,
      shuffle_deck_when_empty,
      reload_time,
      deck_capacity,
    },
    spellIds,
    alwaysIds,
  }: WandState,
  {
    pretty,
    vertical,
    wandCard,
    hideLink,
    tooltips,
  }: WikiWandOptions = defaultOptions,
): string => `{{Wand
| vertical     = ${formatBoolean(vertical)}
| wandCard     = ${formatBoolean(wandCard)}
| hideLink     = ${formatBoolean(hideLink)}
| tooltips     = ${formatBoolean(tooltips)}
| wandName     = ${name}
| wandPic      = ${pic}
| shuffle      = ${formatBoolean(shuffle_deck_when_empty)}
| spellsCast   = ${actions_per_round}
| alwaysCasts  = ${formatSpellsPretty(alwaysIds, indent)}
| spells       = ${formatSpellsPretty(spellIds, indent)}
| castDelay    = ${toSeconds(cast_delay)}
| rechargeTime = ${toSeconds(reload_time)}
| manaMax      = ${mana_max}
| manaCharge   = ${mana_charge_speed}
| capacity     = ${deck_capacity}
| spread       = ${spread}
| speed        = ${speed}
}}`;

import { WandState, isKnownSpell, v2WandStateMapping } from '../../types';
import {
  trimArray,
  objectEntries,
  isNotNullOrUndefined,
  isString,
  isNumber,
  isBoolean,
} from '../../util';
import { defaultWand } from './presets';
import {
  decodeParamAsString,
  decodeParamAsNumber,
  decodeParamAsBoolean,
} from './queryUtils';

export function generateWandStateFromSearch(search: string): WandState {
  const params = new URLSearchParams(search);

  const log: string[] = [];
  const wand = { ...defaultWand };

  objectEntries(wand).forEach(([v1param, defaultValue]) => {
    const raw =
      params.get(v2WandStateMapping[v1param].name) ?? params.get(v1param);
    if (isNotNullOrUndefined(raw)) {
      if (isString(defaultValue)) {
        Object.assign(wand, {
          [v1param]: decodeParamAsString(raw, defaultValue, log.push),
        });
      }
      if (isNumber(defaultValue)) {
        Object.assign(wand, {
          [v1param]: decodeParamAsNumber(raw, defaultValue, log.push),
        });
      }
      if (isBoolean(defaultValue)) {
        Object.assign(wand, {
          [v1param]: decodeParamAsBoolean(raw, defaultValue, log.push),
        });
      }
    }
  });

  return {
    messages: log,
    wand,
    spellIds: trimArray(
      (params.get('s') ?? params.get('spells') ?? '')
        .split(',')
        .map((s) => (isKnownSpell(s) ? s : null)),
      (s) => !s,
    ),
    alwaysIds: trimArray(
      (params.get('w') ?? '')
        .split(',')
        .map((s) => (isKnownSpell(s) ? s : null)),
      (s) => !s,
    ),
  } as WandState;
}

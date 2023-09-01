import { WandState, isKnownSpell } from '../types';
import { trimArray, objectKeys } from '../util';
import { defaultWand } from './presets';

const decodeQueryParamAsString = (
  rawParam: string,
  defaultValue: string = '',
) => {
  const decodedString = decodeURIComponent(rawParam.replace(/\+/g, ' '));
  return decodedString.length === 0 ? defaultValue : decodedString;
};

const decodeQueryParamAsNumber = (rawParam: string, defaultValue: number) => {
  const decodedNumber = Number.parseFloat(decodeQueryParamAsString(rawParam));
  return Number.isNaN(decodedNumber) ? defaultValue : decodedNumber;
};

const decodeQueryParamAsBoolean = (rawParam: string, defaultValue: boolean) => {
  const decodedString = decodeQueryParamAsString(rawParam).toLowerCase();
  if (
    decodedString === '1' ||
    decodedString === 'y' ||
    decodedString === 't' ||
    decodedString.startsWith('true') ||
    decodedString.startsWith('yes')
  ) {
    return true;
  } else if (
    decodedString === '0' ||
    decodedString === 'n' ||
    decodedString === 'f' ||
    decodedString.startsWith('false') ||
    decodedString.startsWith('no') ||
    decodedString === 'n'
  ) {
    return false;
  } else {
    return defaultValue;
  }
};

const encodeQueryParam = (p: string) => encodeURIComponent(p);

export function generateSearchFromWandState(state: WandState) {
  const simplifiedState = {
    ...state,
    spells: trimArray(state.spellIds, (o) => o === null),
  };
  const params = new URLSearchParams();
  Object.entries(simplifiedState.wand).forEach(([k, v]) => {
    if (typeof v === typeof true) {
      params.append(k, encodeQueryParam(Number(v).toString()));
    }
    params.append(k, encodeQueryParam(v.toString()));
  });
  return (
    '?' + params.toString() + '&spells=' + simplifiedState.spells.join(',')
  );
}

export function generateWandStateFromSearch(search: string): WandState {
  const params = new URLSearchParams(search);

  return objectKeys(defaultWand).reduce(
    (acc: WandState, key: keyof typeof defaultWand) => {
      if (params.has(key)) {
        const rawParam = params.get(key);
        const defaultValue = defaultWand[key];
        try {
          if (typeof defaultValue === 'number') {
            acc.wand = {
              ...acc.wand,
              [key]: decodeQueryParamAsNumber(rawParam!, defaultValue),
            };
          } else if (typeof defaultValue === 'boolean') {
            acc.wand = {
              ...acc.wand,
              [key]: decodeQueryParamAsBoolean(rawParam!, defaultValue),
            };
          } else {
            // Assume type string for anything else
            acc.wand = {
              ...acc.wand,
              [key]: decodeQueryParamAsString(rawParam!, defaultValue),
            };
          }
        } catch (e) {
          acc.messages.push(
            `Could not decode param: '${key}' with value: '${rawParam}', using default, error: ${e}`,
          );
        }
      } else {
        acc.messages.push(`Could not find param: '${key}', using default`);
      }
      return acc;
    },
    {
      wand: { ...defaultWand },
      spellIds: trimArray(
        (params.get('spells') ?? '')
          .split(',')
          .map((s) => (s.length === 0 ? null : isKnownSpell(s))),
        (s) => !s,
      ),
      messages: [],
    } as WandState,
  );
}

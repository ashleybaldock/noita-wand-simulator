import { WandState } from './wandState';
import { v2WandStateMapping, WandQueryVersion } from './wand';
import { objectEntries, trimArray } from '../../util';

const encodeQueryParam = (p: string | number | boolean) =>
  typeof p === typeof true
    ? encodeURIComponent(Number(p).toString())
    : encodeURIComponent(p.toString());

export function generateSearchFromWandState(
  state: WandState,
  version: WandQueryVersion = 2,
) {
  return version === 2
    ? generateSearchFromWandStateV2(state)
    : generateSearchFromWandStateV1(state);
}

function generateSearchFromWandStateV2({
  wand,
  spellIds,
  alwaysIds,
}: Readonly<WandState>) {
  const params = new URLSearchParams(
    objectEntries(v2WandStateMapping).map(([v1param, v2param]) => [
      v2param,
      encodeQueryParam(wand[v1param]),
    ]),
  );
  // params.append('s', spellIds.join(','));
  // params.append('w', alwaysIds.join(','));
  return `?${params.toString()}&w=${alwaysIds.join(',')}&s=${spellIds.join(
    ',',
  )}`;
}

function generateSearchFromWandStateV1(state: WandState) {
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

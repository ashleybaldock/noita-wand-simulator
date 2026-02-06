import type { Action } from '@reduxjs/toolkit';
import { clickWand } from '../calc/eval/clickWand';
import { isNotNullOrUndefined, compareSequencesIter } from '../util';
import type { SpellId } from './Wand/spellId';
import { wandsMatchForSimulation } from './Wand/wand';
import type { AppStartListening } from './listenerMiddleware';
import type { RootState } from './store';

import type { ListenerPredicate } from './ListenerPredicate';

/**
 * @returns true if state affecting the URL parameters has changed
 */
const urlSearchHasChanged: ListenerPredicate<RootState> = (
  _unused,
  { config: { config: currentConfig } },
  { config: { config: previousConfig } },
) => false;

/**
 * @returns true if URL search differs from that of window.location
 */
const urlSearchDiffersFromLocation: ListenerPredicate<RootState> = (
  _unused,
  { config: { config: currentConfig } },
  { config: { config: previousConfig } },
) => false;

// return window.location.search !== urlSearch;
// );
// if (window.location.search !== urlSearch) {
// console.log(
// `urlSearch update from ${window.location.search} to ${urlSearch}`,
// );
// const url = new URL(window.location.href);
// url.search = urlSearch;
// window.history.replaceState({ undoIndex }, '', url.toString());
// }
export const startUpdateListener = (startAppListening: AppStartListening) =>
  startAppListening({
    predicate: (...args) =>
      urlSearchHasChanged(...args) && urlSearchDiffersFromLocation(...args),
    effect: async (_action, listenerApi) => {
      // const url = new URL(window.location.href);
      // url.search = urlSearch;
      // window.history.replaceState({ undoIndex }, '', url.toString());
    },
  });

import type { ActionId } from './actionId';
import { entityToActionIds as entityToActionIdsRelease } from './__generated__/main/entityMap';
// import { entityToActionIds as entityToActionIdsBeta } from './__generated__/entityProjectileMap.beta';

// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells

export type EntityPath = keyof typeof entityToActionIdsRelease;

export type EntityToIdsMap = Record<EntityPath, Array<Readonly<ActionId>>>;

export const entityToIdsMap = entityToActionIdsRelease as EntityToIdsMap;

export function isValidEntityPath(x: string): x is EntityPath {
  return Object.prototype.hasOwnProperty.call(entityToIdsMap, x);
}

export function getIdsForEntity(path: EntityPath) {
  return entityToIdsMap[path] ?? [];
}

export function entityToActions(x: string) {
  return isValidEntityPath(x) ? getIdsForEntity(x) : [];
}

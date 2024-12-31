import type { ActionId } from './actionId';
import * as main from './__generated__/main/entityMap';
import type { ProjectileId } from './projectile';

export type EntityToIdsMap = Partial<
  Record<ProjectileId, Array<Readonly<ActionId>>>
>;

export const entityToIdsMap = main.entityToActionIds as EntityToIdsMap;

export function isValidEntityPath(x: string): x is keyof typeof entityToIdsMap {
  return Object.prototype.hasOwnProperty.call(entityToIdsMap, x);
}

export function getIdsForEntity(path: ProjectileId) {
  return entityToIdsMap[path] ?? [];
}

export function entityToActions(x: ProjectileId) {
  return isValidEntityPath(x) ? getIdsForEntity(x) : [];
}

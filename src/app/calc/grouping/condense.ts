import { combineGroups, isRawObject, mergeProperties } from './combineGroups';
import type {
  ActionCall,
  GroupedWandShot,
  Projectile,
  WandShot,
} from '../eval/types';

function condenseActions(calledActions: ActionCall[]) {
  return combineGroups(
    calledActions,
    (a) => a.spell.id,
    (o) => {
      // deck index and source
      if (o.map(isRawObject).every((v) => v)) {
        return mergeProperties(o as ActionCall[], [
          { prop: 'deckIndex', conflictValue: '*' },
          { prop: 'recursion', conflictValue: '*' },
          { prop: 'source', conflictValue: 'multiple' },
          { prop: 'dont_draw_actions', conflictValue: false },
        ]);
      } else {
        return o[0];
      }
    },
  );
}

function condenseProjectiles(projectiles: Projectile[]) {
  const projectilesWithProcessedTriggers = projectiles.map((proj) => {
    if (proj.trigger) {
      return {
        ...proj,
        trigger: condenseActionsAndProjectiles(proj.trigger as WandShot),
      };
    } else {
      return proj;
    }
  });
  return combineGroups(
    projectilesWithProcessedTriggers,
    // NaN always compares false, so projectiles with triggers will never combine
    (p) => (p.trigger && p.trigger.projectiles.length > 0 ? null : p.entity),
    (o) => {
      // deck index and source
      if (o.map(isRawObject).every((v) => v)) {
        return mergeProperties(o as Projectile[], [
          { prop: 'deckIndex', conflictValue: '*' },
        ]);
      } else {
        return o[0];
      }
    },
  );
}

export function condenseActionsAndProjectiles(
  wandShot: WandShot,
): GroupedWandShot {
  return {
    ...wandShot,
    calledActions: condenseActions(wandShot.calledActions),
    projectiles: condenseProjectiles(wandShot.projectiles),
  };
}

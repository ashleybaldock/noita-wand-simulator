import { useMemo } from 'react';
import type { WandCastProjectile } from '../../../calc/eval/WandCastProjectile';
import type { ProjectileId } from '../../../calc/projectile';
import { groupBy, objectEntries } from '../../../util';

export const useGroupedProjectiles = (projectiles: WandCastProjectile[]) => {
  const triggerProjectiles = useMemo(
    () => projectiles.filter(({ payload }) => payload !== undefined),
    [projectiles],
  );
  const nonTriggerProjectiles = useMemo(
    () => projectiles.filter(({ payload }) => payload === undefined),
    [projectiles],
  );

  const groupedProjectiles: Record<ProjectileId, WandCastProjectile[]> =
    useMemo(
      () => groupBy(projectiles, ({ entity }) => entity),
      [nonTriggerProjectiles],
    );

  const projectilesWithGroupedCounts: [
    projectile: WandCastProjectile,
    count: number,
  ][] = useMemo(
    () =>
      objectEntries(groupedProjectiles).map(([, groupedProjectiles]) => [
        groupedProjectiles[0],
        groupedProjectiles.length,
      ]),
    [groupedProjectiles],
  );

  return {
    triggerProjectiles,
    nonTriggerProjectiles,
    projectilesWithGroupedCounts,
  };
};

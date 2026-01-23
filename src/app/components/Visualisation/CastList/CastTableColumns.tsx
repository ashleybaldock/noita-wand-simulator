import { Fragment } from 'react';
import type { WandCastId } from '../../../calc/eval/WandCast';
import { useCast, useCastLookup } from '../../../redux';
import { isNotNullOrUndefined } from '../../../util';
import {
  FieldNamesColumn,
  IconsColumn,
  TotalsColumn,
  WandStatsColumn,
  SubTotalsColumn,
  ProjectileColumn,
} from './CastStateColumn';

export const CastTableColumns = ({
  $castId,
  $nestingPrefix = [],
}: {
  $castId: WandCastId;
  $nestingPrefix?: Array<number>;
}) => {
  const cast = useCast($castId);
  if (!cast) {
    return null;
  }
  const { castState, manaDrain, triggerType, projectiles } = cast;
  const castLookup = useCastLookup();

  return (
    <>
      {$nestingPrefix.length === 0 ? (
        <>
          <FieldNamesColumn castState={castState} />
          <IconsColumn castState={castState} />
          <TotalsColumn $castState={castState} $manaDrain={manaDrain} />
          <WandStatsColumn $castState={castState} />
        </>
      ) : (
        <>
          <SubTotalsColumn
            $triggerType={triggerType}
            $castState={castState}
            $manaDrain={manaDrain}
          />
        </>
      )}
      {projectiles.map((projectile, index, arr) => {
        const isEndOfTrigger = index === arr.length - 1;
        const triggerCast = ((lookupResult) =>
          ((lookupResult?.projectiles?.length ?? 0) > 0 && lookupResult) ||
          undefined)(castLookup.get(projectile?.payload ?? -1));

        return (
          <Fragment key={index}>
            <ProjectileColumn
              $castState={castState}
              $manaDrain={manaDrain}
              $insideTrigger={true}
            />
            {isNotNullOrUndefined(triggerCast) && (
              <CastTableColumns
                $castId={triggerCast.id}
                $nestingPrefix={[...$nestingPrefix, isEndOfTrigger ? 0 : 1]}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

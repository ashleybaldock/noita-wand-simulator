import { Fragment, useMemo } from 'react';
import type { WandCastId } from '../../../calc/eval/WandCast';
import { useCast, useCastLookup } from '../../../redux';
import { groupBy, isNotNullOrUndefined, objectEntries } from '../../../util';
import {
  FieldNamesColumn,
  IconsColumn,
  TotalsColumn,
  WandStatsColumn,
  SubTotalsColumn,
  ProjectileColumn,
} from './CastStateColumn';
import styled from 'styled-components';
import { useGroupedProjectiles } from './useGroupedProjectiles';

const Scope = styled.div<{ colCount: number }>`
  display: grid;
  grid-template-rows: subgrid;
  ${({ colCount }) =>
    colCount &&
    `grid-template-columns: [subtotal-start] var(--colw) [subtotal-end projs-start] repeat(${colCount}, var(--colw)) [projs-end];`}
  grid-column: scopes-start/scopes-end;
  grid-row: 2/-1;
`;

export const CastTableScope = ({
  castId,
  nestingPrefix = [],
}: {
  castId: WandCastId;
  nestingPrefix?: Array<number>;
}) => {
  const cast = useCast(castId);
  if (!cast) {
    return null;
  }
  const { castState, manaDrain, triggerType, projectiles } = cast;
  const castLookup = useCastLookup();

  const { triggerProjectiles, projectilesWithGroupedCounts } =
    useGroupedProjectiles(projectiles);

  return (
    <Scope colCount={projectiles.length} data-name={'Scope'}>
      {projectilesWithGroupedCounts.map(([projectile, count], index, arr) => {
        const isEndOfTrigger = index === arr.length - 1;

        const triggerCast = ((lookupResult) =>
          ((lookupResult?.projectiles?.length ?? 0) > 0 && lookupResult) ||
          undefined)(castLookup.get(projectile?.payload ?? -1));

        return (
          <Fragment key={index}>
            {nestingPrefix.length > 0 && (
              <SubTotalsColumn
                triggerType={triggerType}
                castState={castState}
                manaDrain={manaDrain}
              />
            )}
            <ProjectileColumn
              count={count}
              castState={castState}
              manaDrain={manaDrain}
              insideTrigger={true}
            />
            {isNotNullOrUndefined(triggerCast) && (
              <CastTableScope
                castId={triggerCast.id}
                nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
              />
            )}
          </Fragment>
        );
      })}
    </Scope>
  );
};

export const CastTableColumns = ({
  castId,
  nestingPrefix = [],
}: {
  castId: WandCastId;
  nestingPrefix?: Array<number>;
}) => {
  const cast = useCast(castId);
  if (!cast) {
    return null;
  }
  const { castState, manaDrain, triggerType } = cast;

  return (
    <>
      {nestingPrefix.length === 0 ? (
        <>
          <FieldNamesColumn castState={castState} />
          <IconsColumn castState={castState} />
          <TotalsColumn castState={castState} manaDrain={manaDrain} />
          <WandStatsColumn castState={castState} />
        </>
      ) : (
        <>
          <SubTotalsColumn
            triggerType={triggerType}
            castState={castState}
            manaDrain={manaDrain}
          />
        </>
      )}
      <CastTableScope
        castId={castId}
        nestingPrefix={nestingPrefix}
      ></CastTableScope>
    </>
  );
};

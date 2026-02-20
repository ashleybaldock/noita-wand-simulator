import { Fragment } from 'react';
import { useCastLookup } from '../../../redux';
import { isNotNullOrUndefined } from '../../../util';
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
import type { WandCastResult } from '../../../calc/eval/WandCastResult';

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
  cast,
  nestingPrefix = [],
}: {
  cast: WandCastResult;
  nestingPrefix?: Array<number>;
}) => {
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
              projectile={projectile}
              castState={castState}
              manaDrain={manaDrain}
              insideTrigger={true}
            />
            {isNotNullOrUndefined(triggerCast) && (
              <CastTableScope
                cast={triggerCast}
                nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
              />
            )}
          </Fragment>
        );
      })}
      {triggerProjectiles.map((projectile, index, arr) => {
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
              count={1}
              castState={castState}
              manaDrain={manaDrain}
              projectile={projectile}
              insideTrigger={true}
            />
            {isNotNullOrUndefined(triggerCast) && (
              <CastTableScope
                cast={triggerCast}
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
  cast,
  nestingPrefix = [],
}: {
  cast: WandCastResult;
  nestingPrefix?: Array<number>;
}) => {
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
        cast={cast}
        nestingPrefix={nestingPrefix}
      ></CastTableScope>
    </>
  );
};

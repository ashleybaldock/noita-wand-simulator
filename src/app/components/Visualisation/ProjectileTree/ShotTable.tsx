import styled from 'styled-components';
import {
  FieldNamesColumn,
  IconsColumn,
  ProjectileColumn,
  SubTotalsColumn,
  TotalsColumn,
} from './CastStateColumn';
import { ProjectileActionGroup } from './ProjectileActionGroup';
import { GroupedProjectile, GroupedWandShot } from '../../../calc/eval/types';
import { isNotNullOrUndefined, NBSP } from '../../../util';
import {
  GroupedObject,
  isRawObject,
} from '../../../calc/grouping/combineGroups';
import {
  IconsColumnHeading,
  ProjectileHeading,
  ShotIndexColumnHeading,
  SubTotalsColumnHeading,
  TotalsColumnHeading,
} from './ColumnHeading';

const StyledShotTable = styled.div`
  --nesting-offset: var(--sizes-nesting-offset, 16px);

  display: grid;
  gap: 0;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  grid-template-rows:
    [heading] min-content
    [timing] repeat(5, min-content)
    [motion] repeat(6, min-content)
    [crit] repeat(6, min-content)
    [damage] repeat(15, min-content)
    [impact] repeat(5, min-content)
    [material] repeat(5, min-content);
  grid-row: heading;

  margin: 0.1em 0em 0.4em 0em;
  border: 1px solid rgba(255, 0, 0, 0.3);
`;

export const ShotTableColumns = ({
  shotIndex,
  shot: { castState, manaDrain, triggerType, projectiles },
  nestingLevel = 0,
}: {
  shotIndex: number;
  shot: GroupedWandShot;
  nestingLevel?: number;
}) => {
  return (
    <>
      {nestingLevel === 0 ? (
        <>
          <ShotIndexColumnHeading index={shotIndex} $nestingLevel={nestingLevel}>
            {shotIndex}
          </ShotIndexColumnHeading>
          <FieldNamesColumn castState={castState} />
          <IconsColumnHeading $nestingLevel={nestingLevel}>
            {''}
          </IconsColumnHeading>
          <IconsColumn castState={castState} />
          <TotalsColumnHeading $origin={true} $nestingLevel={nestingLevel}>
            {`Shot${NBSP}Totals`}
          </TotalsColumnHeading>
          <TotalsColumn castState={castState} manaDrain={manaDrain} />
        </>
      ) : (
        <>
          <SubTotalsColumnHeading
            $nestingLevel={nestingLevel}
            $triggerType={triggerType}
          >
            {`Payload${NBSP}Totals`}
          </SubTotalsColumnHeading>
          <SubTotalsColumn
            triggerType={triggerType}
            castState={castState}
            manaDrain={manaDrain}
          />
        </>
      )}
      {projectiles.map(
        (projectile: GroupedObject<GroupedProjectile>, index, arr) => {
          const last = index === arr.length - 1;
          const trigger =
            (isRawObject<GroupedProjectile>(projectile) &&
              projectile.trigger &&
              projectile.trigger.projectiles.length > 0 &&
              projectile.trigger) ||
            undefined;
          return (
            <>
              <ProjectileHeading
                $branch={isNotNullOrUndefined(trigger)}
                $endpoint={last}
                $nestingLevel={nestingLevel}
              >
                <ProjectileActionGroup
                  nestingLevel={nestingLevel}
                  group={projectile}
                />
              </ProjectileHeading>
              <ProjectileColumn
                castState={castState}
                manaDrain={manaDrain}
                insideTrigger={true}
              />
              {isNotNullOrUndefined(trigger) && (
                <ShotTableColumns
                  shot={trigger}
                  shotIndex={index}
                  nestingLevel={nestingLevel + 1}
                />
              )}
            </>
          );
        },
      )}
    </>
  );
};

export const ShotTable = ({
  shotIndex,
  shot,
}: {
  shotIndex: number;
  shot: GroupedWandShot;
}) => {
  return (
    <StyledShotTable>
      <ShotTableColumns shotIndex={shotIndex} shot={shot}></ShotTableColumns>
    </StyledShotTable>
  );
};

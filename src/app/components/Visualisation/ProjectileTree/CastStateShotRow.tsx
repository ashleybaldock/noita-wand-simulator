import styled from 'styled-components/macro';
import {
  CastStateNamesColumn,
  CastStateIconsColumn,
  CastStateProjectileColumn,
  CastStateSubTotalsColumn,
  CastStateTotalsColumn,
} from './CastStateColumn';
import { ProjectileActionGroup } from './ProjectileActionGroup';
import { GroupedWandShot } from '../../../calc/eval/types';
import { isRawObject } from '../../../calc/grouping/combineGroups';
import { TriggerCondition } from '../../../calc/trigger';

const ProjectileShotTable = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
  border: 1px solid rgba(255, 0, 0, 0.3);

  display: grid;
  gap: 2px 0;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  grid-template-rows:
    [heading] min-content
    [timing] repeat(4, min-content)
    [motion] repeat(4, min-content)
    [crit] repeat(2, min-content)
    [damage] repeat(15, min-content)
    [impact] repeat(5, min-content)
    [material] repeat(5, min-content);
  grid-row: heading;
`;

const BaseColumnHeading = styled.div<{ nestingLevel: number }>`
  grid-row: heading;
  position: relative;
  display: flex;
  flex-direction: row;

  height: 60px;
  padding: 0 0.3em;
  padding-top: calc(
    var(--sizes-nesting-offset) * ${({ nestingLevel }) => nestingLevel}
  );
`;
const ShotSubTotal = styled(BaseColumnHeading)`
  font-size: 1em;
  align-self: start;
  justify-content: center;
  border: 1px dashed purple;

  width: 3em;
  align-items: end;
  text-align: center;
`;
const ShotIconsColumnHeading = styled(BaseColumnHeading)`
  width: 1em;
`;
const ShotIndexColumnHeading = styled(BaseColumnHeading)<{
  index: number;
}>`
  font-size: 2em;
  padding: 18px;

  &::after {
    content: '${({ index }) =>
      index === 1
        ? 'st'
        : index === 2
        ? 'nd'
        : index === 3
        ? 'rd'
        : 'th'} shot';
    font-size: 0.4em;
    white-space: nowrap;
    align-self: start;
  }
}
`;

export const CastStateColumns = ({
  shotIndex,
  shot,
  nestingLevel = 0,
  triggerType,
}: {
  shotIndex: number;
  shot: GroupedWandShot;
  nestingLevel?: number;
  triggerType?: TriggerCondition;
}) => {
  return (
    <>
      {nestingLevel === 0 ? (
        <>
          <ShotIndexColumnHeading index={shotIndex} nestingLevel={nestingLevel}>
            {shotIndex}
          </ShotIndexColumnHeading>
          <CastStateNamesColumn castState={shot.castState} />
          <ShotIconsColumnHeading nestingLevel={nestingLevel}>
            {''}
          </ShotIconsColumnHeading>
          <CastStateIconsColumn castState={shot.castState} />
          <ShotSubTotal nestingLevel={nestingLevel}>{'Total'}</ShotSubTotal>
          <CastStateTotalsColumn
            castState={shot.castState}
            manaDrain={shot.manaDrain}
          />
        </>
      ) : (
        <>
          <ShotSubTotal nestingLevel={nestingLevel}>{'Total'}</ShotSubTotal>
          <CastStateSubTotalsColumn
            triggerType={triggerType}
            castState={shot.castState}
            manaDrain={shot.manaDrain}
          />
        </>
      )}
      {shot.projectiles.map((projectile, index) => {
        let triggerComponent;
        if (isRawObject(projectile)) {
          triggerComponent = projectile.trigger &&
            projectile.trigger.projectiles.length > 0 && (
              <CastStateColumns
                shot={projectile.trigger}
                shotIndex={index}
                triggerType={'timer'}
                nestingLevel={nestingLevel + 1}
              />
            );
        }
        return (
          <>
            <ProjectileActionGroup
              nestingLevel={nestingLevel}
              group={projectile}
            />
            <CastStateProjectileColumn
              castState={shot.castState}
              manaDrain={shot.manaDrain}
              insideTrigger={true}
            />
            {triggerComponent}
          </>
        );
      })}
    </>
  );
};

export const CastStateShotRow = ({
  shotIndex,
  shot,
}: {
  shotIndex: number;
  shot: GroupedWandShot;
}) => {
  return (
    <ProjectileShotTable>
      <CastStateColumns shotIndex={shotIndex} shot={shot}></CastStateColumns>
    </ProjectileShotTable>
  );
};

import styled from 'styled-components/macro';
import { ProjectileCastState } from './ProjectileCastState';
import { ProjectileActionGroup } from './ProjectileActionGroup';
import { GroupedWandShot } from '../../../calc/eval/types';
import { isRawObject } from '../../../calc/grouping/combineGroups';

const ProjectileShotTable = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  margin: 1px;
  border: 1px solid rgba(255, 0, 0, 0.3);

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  grid-template-rows:
    [heading] 80px
    [timing] repeat(4, min-content)
    [motion] repeat(4, min-content)
    [crit] repeat(2, min-content)
    [damage] repeat(15, min-content)
    [impact] repeat(5, min-content)
    [material] repeat(5, min-content);
  grid-row: heading;
`;

const StyledProjectileDiv = styled.div<{
  indent: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: ${({ indent }) => (indent ? 24 : 0)}px;
  border: 1px solid orange;
`;

const StyledMetadataDiv = styled.div<{
  indent: boolean;
}>`
  margin-top: ${({ indent }) => (indent ? 24 : 0)}px;
`;

const TriggerDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 4px solid #777;
  border-top: 0;
  border-bottom: 0;
  margin-bottom: 10px;
`;

const ShotIndex = styled.div<{ index: number }>`
  display: flex;
  flex-direction: row;
  font-size: 2em;
  grid-row: heading;
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

export const ProjectileTreeShotResult = ({
  shot,
  indent,
  nestingLevel = indent ? 1 : 0,
  index,
  triggerType = 'none',
}: {
  shot: GroupedWandShot;
  indent: boolean;
  nestingLevel?: number;
  index: number;
  triggerType?: 'collide' | 'timer' | 'death' | 'none';
}) => {
  return (
    <ProjectileShotTable>
      <ShotIndex index={index}>
        {nestingLevel === 0 ? `${index}` : `Trigger`}
      </ShotIndex>
      <ProjectileCastState
        castState={shot.castState}
        manaDrain={shot.manaDrain}
        trigger={nestingLevel !== 0}
      />
      {shot.projectiles.map((projectile, index) => {
        let triggerComponent;
        if (isRawObject(projectile)) {
          triggerComponent = projectile.trigger &&
            projectile.trigger.projectiles.length > 0 && (
              <ProjectileTreeShotResult
                shot={projectile.trigger}
                index={index}
                indent={true}
                triggerType={'timer'}
              />
            );
        }
        return (
          <>
            <ProjectileActionGroup group={projectile} />
            {triggerComponent}
          </>
        );
      })}
    </ProjectileShotTable>
  );
};

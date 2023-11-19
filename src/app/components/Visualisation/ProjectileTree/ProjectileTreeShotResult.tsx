import styled from 'styled-components/macro';
import { ProjectileCastState } from './ProjectileCastState';
import { ProjectileActionGroup } from './ProjectileActionGroup';
import { GroupedWandShot } from '../../../calc/eval/types';
import { ShotMetadata } from '../ShotMetadata';
import { isRawObject } from '../../../calc/grouping/combineGroups';

const StyledShotDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  margin: 1px;
  border: 1px solid red;
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

const ShotIndex = styled.div``;

export const ProjectileTreeShotResult = ({
  shot,
  indent,
  nestingLevel = indent ? 1 : 0,
  index,
}: {
  shot: GroupedWandShot;
  indent: boolean;
  nestingLevel?: number;
  index: number;
}) => {
  return (
    <StyledShotDiv>
      <ShotIndex>{nestingLevel === 0 ? `Shot #${index}` : `Trigger`}</ShotIndex>
      <StyledMetadataDiv indent={indent}>
        <ProjectileCastState
          castState={shot.castState}
          manaDrain={shot.manaDrain}
          trigger={nestingLevel !== 0}
        />
      </StyledMetadataDiv>
      {shot.projectiles.map((projectile, index) => {
        let triggerComponent;
        if (isRawObject(projectile)) {
          triggerComponent = projectile.trigger &&
            projectile.trigger.projectiles.length > 0 && (
              <TriggerDiv>
                <ProjectileTreeShotResult
                  shot={projectile.trigger}
                  index={index}
                  indent={true}
                />
              </TriggerDiv>
            );
        }
        return (
          <StyledProjectileDiv key={index} indent={indent}>
            <ProjectileActionGroup group={projectile} />
            {triggerComponent}
          </StyledProjectileDiv>
        );
      })}
    </StyledShotDiv>
  );
};

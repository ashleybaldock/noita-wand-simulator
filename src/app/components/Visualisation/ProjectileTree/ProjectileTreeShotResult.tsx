import styled from 'styled-components/macro';
import { ProjectileCastState } from './ProjectileCastState';
import { WandActionGroup } from '../WandActionGroup';
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
`;

const StyledProjectileDiv = styled.div<{
  indent: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: ${({ indent }) => (indent ? 24 : 0)}px;
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

// list of all actions played, and sub-ShotResults for triggers
export const ProjectileTreeShotResult = ({
  shot,
  indent,
}: {
  shot: GroupedWandShot;
  indent: boolean;
}) => {
  return (
    <StyledShotDiv>
      <div>
        <StyledMetadataDiv indent={indent}>
          {!indent && (
            <ShotMetadata
              manaDrain={shot.manaDrain}
              castDelay={shot.castState?.fire_rate_wait}
            />
          )}
          <ProjectileCastState castState={shot.castState} />
        </StyledMetadataDiv>
      </div>
      {shot.projectiles.map((projectile, index) => {
        let triggerComponent;
        if (isRawObject(projectile)) {
          triggerComponent = projectile.trigger &&
            projectile.trigger.projectiles.length > 0 && (
              <TriggerDiv>
                <ProjectileTreeShotResult
                  shot={projectile.trigger}
                  indent={true}
                />
              </TriggerDiv>
            );
        }
        return (
          <StyledProjectileDiv key={index} indent={indent}>
            <WandActionGroup group={projectile} />
            {triggerComponent}
          </StyledProjectileDiv>
        );
      })}
    </StyledShotDiv>
  );
};

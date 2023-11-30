import styled from 'styled-components/macro';
import {
  FieldNamesColumn,
  IconsColumn,
  ProjectileColumn,
  SubTotalsColumn,
  TotalsColumn,
} from './CastStateColumn';
import { ProjectileActionGroup } from './ProjectileActionGroup';
import { GroupedWandShot } from '../../../calc/eval/types';
import { isRawObject } from '../../../calc/grouping/combineGroups';
import { TriggerCondition, getIconForTrigger } from '../../../calc/trigger';
import { isNotNullOrUndefined, toBackgroundImage } from '../../../util';
import { WithDebugHints } from '../../Debug';

const StyledShotTable = styled.div`
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

const HeadingOuter = styled.div<{
  nestingLevel?: number;
  triggerType?: TriggerCondition;
}>`
  grid-row: heading;
  position: relative;
  display: flex;
  flex-direction: column;

  height: auto;
  padding-top: calc(
    var(--sizes-nesting-offset) * ${({ nestingLevel = 0 }) => nestingLevel}
  );

  &::before {
    display: none;
    content: '';
    height: 2.4em;
    width: 100%;

    background-position: center 0.2em;
    background-repeat: no-repeat;
    background-size: 2em;
    image-rendering: pixelated;
    ${({ triggerType }) =>
      isNotNullOrUndefined(triggerType) &&
      toBackgroundImage(getIconForTrigger(triggerType))}
  }
`;
const HeadingInner = styled.div`
  min-height: 60px;
  box-sizing: border-box;

  ${WithDebugHints} && {
    border: 1px dashed #00009c;
  }
`;

const BaseColumnHeading = ({
  nestingLevel,
  triggerType,
  children,
  className,
}: {
  nestingLevel?: number;
  triggerType?: TriggerCondition;
  className?: string;
} & React.PropsWithChildren) => {
  return (
    <HeadingOuter
      className={className}
      triggerType={triggerType}
      nestingLevel={nestingLevel}
    >
      <HeadingInner>{children}</HeadingInner>
    </HeadingOuter>
  );
};
const TotalsColumnHeading = styled(BaseColumnHeading)`
  font-size: 1em;
  align-self: start;
  justify-content: stretch;

  min-width: 4em;
  align-items: start;
  text-align: center;

  &::before {
    display: initial;
  }

  ${WithDebugHints} && {
    border-left: 1px solid #580058;
    border-top: 1px solid #630063;
  }
`;
const IconsColumnHeading = styled(BaseColumnHeading)`
  width: 1.6em;
`;
const ShotIndexColumnHeading = styled(BaseColumnHeading)<{
  index: number;
}>`
  font-size: 2em;
  padding: 18px;
  padding-top: 0;
  flex-direction: row;
  align-self: start;

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
          <ShotIndexColumnHeading index={shotIndex} nestingLevel={nestingLevel}>
            {shotIndex}
          </ShotIndexColumnHeading>
          <FieldNamesColumn castState={castState} />
          <IconsColumnHeading nestingLevel={nestingLevel}>
            {''}
          </IconsColumnHeading>
          <IconsColumn castState={castState} />
          <TotalsColumnHeading nestingLevel={nestingLevel}>
            {'Shot Total'}
          </TotalsColumnHeading>
          <TotalsColumn castState={castState} manaDrain={manaDrain} />
        </>
      ) : (
        <>
          <TotalsColumnHeading
            nestingLevel={nestingLevel}
            triggerType={triggerType}
          >
            {'Payload Total'}
          </TotalsColumnHeading>
          <SubTotalsColumn
            triggerType={triggerType}
            castState={castState}
            manaDrain={manaDrain}
          />
        </>
      )}
      {projectiles.map((projectile, index) => {
        let triggerComponent;
        if (isRawObject(projectile)) {
          triggerComponent = projectile.trigger &&
            projectile.trigger.projectiles.length > 0 && (
              <ShotTableColumns
                shot={projectile.trigger}
                shotIndex={index}
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
            <ProjectileColumn
              castState={castState}
              manaDrain={manaDrain}
              insideTrigger={true}
            />
            {triggerComponent}
          </>
        );
      })}
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

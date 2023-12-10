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

const HeadingInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  box-sizing: border-box;

  ${WithDebugHints} && {
    border: 1px dashed #00009c;
  }
`;

const HeadingOuter = styled.div<{
  nestingLevel?: number;
  triggerType?: TriggerCondition;
  alignTop?: boolean;
}>`
  grid-row: heading;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: center;
  align-self: stretch;

  ${({ alignTop = true, nestingLevel = 0 }) =>
    false &&
    (alignTop
      ? `
  height: auto;
  border-top: 3px solid var(--color-arrow-action);
    padding-top: calc(var(--sizes-nesting-offset) * 1);

  justify-content: stretch;
    `
      : `
  border-bottom: 3px solid var(--color-arrow-action);
    padding-bottom: calc(var(--sizes-nesting-offset) * 1);
  justify-content: end;
    `)}
  & ${HeadingInner}::before {
    display: none;
    content: '';
    height: 2.4em;
    width: 100%;

    background-repeat: no-repeat;
    image-rendering: pixelated;
    ${({ triggerType }) =>
      isNotNullOrUndefined(triggerType)
        ? `
    background-position: center 0.2em;
    background-size: 2em;
        ${toBackgroundImage(getIconForTrigger(triggerType))}
        `
        : `
    background-position: center center;
    background-size: 3em;
        background-image: url('/data/items_gfx/wands/wand_0104.png');
        `}
  }
`;
const LineSpacer = styled.div<{
  alignTop?: boolean;
  line?: 'solid' | 'dashed' | 'dotted';
}>`
  ${({ alignTop = true, line = 'solid' }) => `
    ${line === 'dashed' ? `opacity: 0.6;` : `opacity: 1;`}
    ${
      alignTop
        ? `
  border-top: 3px ${line} var(--color-arrow-action);
  padding-top: calc(var(--sizes-nesting-offset) * 1);
  `
        : `
  border-bottom: 3px ${line} var(--color-arrow-action);
  padding-bottom: calc(var(--sizes-nesting-offset) * 1);
`
    }`}
`;

const BaseColumnHeading = ({
  nestingLevel = 0,
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
      {nestingLevel > 0 &&
        [...Array(nestingLevel)].map((_, i) => (
          <LineSpacer line={'dashed'} key={i} />
        ))}
      <LineSpacer key={nestingLevel} />

      <HeadingInner>{children}</HeadingInner>
    </HeadingOuter>
  );
};
const ProjectileHeading = styled(BaseColumnHeading)`
  background-color: black;
`;

const TotalsColumnHeading = styled(BaseColumnHeading)`
  font-size: 1em;

  min-width: 4em;

  border-left: 1px dotted var(--color-vis-cs-inborder);
  background-color: black;

  & ${HeadingInner}::before {
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
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  font-size: 2em;
  padding: 0 18px;

  & ${HeadingInner} {
    min-height: unset;
    transform: translate(0.5em);
    flex-direction: column-reverse;
    justify-content: center;
  }

  & ${HeadingInner}::before {
    content: 'shot';
    display: flex;
    justify-content: center;
    position: relative;
    top: -0.3em;
    font-size: 0.4em;
    white-space: nowrap;
    padding-top: 0.2em;
  }
  & ${HeadingInner}::after {
    display: flex;
    justify-content: end;
    position: relative;
    top: 0.6em;
    left: 0.8em;
    content: '${({ index }) =>
      index > 4 && index < 20
        ? 'th'
        : index % 20 === 1
        ? 'st'
        : index % 20 === 2
        ? 'nd'
        : index % 20 === 3
        ? 'rd'
        : 'th'}';
    font-size: 0.4em;
    white-space: nowrap;
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
            {'Total'}
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
            <ProjectileHeading nestingLevel={nestingLevel}>
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

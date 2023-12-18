import styled from 'styled-components';
import { TriggerCondition, getIconForTrigger } from '../../../calc/trigger';
import { isNotNullOrUndefined, toBackgroundImage } from '../../../util';
import { WithDebugHints } from '../../Debug';
import { LineSpacer } from './LineSpacer';

const HeadingInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  box-sizing: border-box;

  margin-top: -10px;

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

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
  }
  ${WithDebugHints} &::before {
    border-left: 3px solid blue;
  }

  & ${HeadingInner}::before {
    display: none;
    content: '';
    width: 100%;

    margin-top: -5px;

    background-repeat: no-repeat;
    image-rendering: pixelated;
  }
`;
const BaseColumnHeading = ({
  nestingLevel = 0,
  triggerType,
  origin = false,
  endpoint = false,
  branch = false,
  children,
  className,
}: {
  nestingLevel?: number;
  triggerType?: TriggerCondition;
  origin?: boolean;
  endpoint?: boolean;
  branch?: boolean;
  className?: string;
} & React.PropsWithChildren) => {
  return (
    <HeadingOuter
      className={className}
      triggerType={triggerType}
      nestingLevel={nestingLevel}
    >
      <LineSpacer
        nestingLevel={nestingLevel}
        origin={origin}
        endpoint={endpoint}
        branch={branch}
      />

      <HeadingInner>{children}</HeadingInner>
    </HeadingOuter>
  );
};
export const ProjectileHeading = styled(BaseColumnHeading)`
  background-color: black;
`;

export const TotalsColumnHeading = styled(BaseColumnHeading)`
  height: 100%;

  font-size: 1em;

  min-width: 5.6em;
  justify-content: start;

  border-left: 1px dotted var(--color-vis-cs-inborder);
  background-color: black;

  & ${LineSpacer} {
  }

  & ${HeadingInner}::before {
    margin-top: 10px;
    display: initial;

    ${({ triggerType }) =>
      isNotNullOrUndefined(triggerType)
        ? `
    height: 2.4em;
    background-position: center 0.2em;
    background-size: 2em;
        ${toBackgroundImage(getIconForTrigger(triggerType))}
        `
        : `
    height: 2.4em;
    background-position: center center;
    background-size: 3em;
        background-image: url('/data/items_gfx/wands/wand_0104.png');
        `}
  }

  ${WithDebugHints} && {
    border-left: 1px solid #580058;
    border-top: 1px solid #630063;
  }
`;

export const SubTotalsColumnHeading = styled(TotalsColumnHeading)`
  & ${HeadingInner}::before {
    margin-top: -5px;
  }
`;

export const IconsColumnHeading = styled(BaseColumnHeading)`
  width: 1.6em;

  & ${LineSpacer} {
    display: none;
  }
`;

export const ShotIndexColumnHeading = styled(BaseColumnHeading)<{
  index: number;
}>`
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  font-size: 2em;
  padding: 0 18px;

  & ${LineSpacer} {
    display: none;
  }

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
    padding-bottom: 0.6em;
  }
}
`;

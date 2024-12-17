import styled from 'styled-components';
import type { TriggerCondition } from '../../../calc/trigger';
import { getSpriteForTrigger } from '../../../calc/trigger';
import { isNotNullOrUndefined, ordinalSuffix, toUrl } from '../../../util';
import { WithDebugHints } from '../../Debug';
import { LineSpacer } from './LineSpacer';

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
  nestingPrefix: Array<number>;
  nestingLevel?: number;
  triggerType?: TriggerCondition;
  isStartOfTrigger?: boolean;
  isEndOfTrigger?: boolean;
  alignTop?: boolean;
}>`
  grid-row: heading;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: center;
  align-self: stretch;

  ${WithDebugHints} &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
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

  ${({ isStartOfTrigger }) =>
    isStartOfTrigger &&
    `
  position: sticky;
  left: 2em;
  z-index: 200;
    `}
  ${({ isEndOfTrigger }) =>
    isEndOfTrigger &&
    `
  position: sticky;
  left: 2em;
  z-index: 200;
    `}
`;
const BaseColumnHeading = ({
  nestingPrefix = [],
  nestingLevel = 0,
  triggerType,
  origin = false,
  isEndOfTrigger = false,
  isStartOfTrigger = false,
  showLineSpacer = true,
  children,
  className,
}: {
  nestingPrefix: Array<number>;
  nestingLevel?: number;
  triggerType?: TriggerCondition;
  origin?: boolean;
  isEndOfTrigger?: boolean;
  isStartOfTrigger?: boolean;
  showLineSpacer?: boolean;
  className?: string;
} & React.PropsWithChildren) => {
  return (
    <HeadingOuter
      className={className}
      triggerType={triggerType}
      nestingLevel={nestingLevel}
      nestingPrefix={nestingPrefix}
      isStartOfTrigger={isStartOfTrigger}
      isEndOfTrigger={isEndOfTrigger}
    >
      {showLineSpacer && (
        <LineSpacer
          nestingPrefix={nestingPrefix}
          origin={origin}
          endpoint={isEndOfTrigger}
          branch={isStartOfTrigger}
        />
      )}

      <HeadingInner>{children}</HeadingInner>
    </HeadingOuter>
  );
};

export const ColumnHeadingWithLineSpacer = styled(BaseColumnHeading).attrs({
  showLineSpacer: true,
})``;

export const ProjectileHeading = styled(ColumnHeadingWithLineSpacer)`
  background-color: black;
`;

export const TotalsColumnHeading = styled(ColumnHeadingWithLineSpacer)`
  height: 100%;

  font-size: 1em;

  min-width: 5.6em;
  justify-content: start;

  border-left: 1px dotted var(--color-vis-cs-inborder);
  background-color: black;

  & ${HeadingInner}::before {
    margin-top: 10px;
    display: initial;

    ${({ triggerType }) =>
      isNotNullOrUndefined(triggerType)
        ? `
    height: 2.4em;
    background-position: center 0.2em;
    background-size: 2em;
    background-image: ${toUrl(getSpriteForTrigger(triggerType))}
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
`;

export const ShotIndexColumnHeading = styled(BaseColumnHeading)<{
  index: number;
}>`
  position: sticky;
  left: 0px;
  background-color: black;
  border: 1px dotted #b07ae5;
  left: -76px;
  z-index: 100;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  font-size: 2em;
  padding: 0 18px;

  & ${HeadingInner} {
    width: 40px;
    height: 100%;
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
    top: 0em;
    font-size: 0.4em;
    white-space: nowrap;
    padding-top: 0.2em;
  }
  & ${HeadingInner}::after {
    display: flex;
    justify-content: end;
    position: relative;
    top: 1.6em;
    left: 0.9em;
    content: '${(props) => ordinalSuffix(props.index)}';
    font-size: 0.4em;
    white-space: nowrap;
    padding-bottom: 0.6em;
  }
}
`;

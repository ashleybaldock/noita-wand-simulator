import styled from 'styled-components';
import type { Spell } from '../../../calc/spell';
import { DEFAULT_SIZE } from '../../../util';
import { ActionTreeShotResultNodeDiv } from '../ActionTree';

type ArrowPath = 'down-right' | 'down' | '↳';

const LineDiv = styled.div<{
  size: number;
  swept: boolean;
}>`
  position: absolute;

  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: var(--color-arrow-action-text);

  border: var(--arrow-w) hidden var(--color-arrow-action);
  border-bottom-style: solid;
  border-left-style: solid;

  ${({ swept }) =>
    swept
      ? `
  top: 2.5px;
  left: -46px;
  width: 28px;
  height: 23px;
  border-radius: 12px 0 0 12px;
    `
      : `
      
  left: calc(var(--arrow-hz) * -1);
  width: var(--arrow-hz);
  height: calc(50% - var(--arrow-w) / 2);
  top: 0;
  border-radius: var(--radius-arrow);
  `}

  ${ActionTreeShotResultNodeDiv}:first-of-type > div > & {
    border-left-style: hidden;
    border-radius: 0;
  }
  ${ActionTreeShotResultNodeDiv}:first-of-type > div > &::before {
    border-left-style: hidden;
    border-radius: 0;
  }
`;

const ArrowHeadDiv = styled.div`
  position: absolute;
  top: calc(50% - (var(--ahead-h) * 0.5));
  height: var(--ahead-h);
  left: calc(var(--arrow-hz, 48px) * -1);
  width: var(--arrow-hz, 48px);
  border-radius: var(--radius-arrow);
  height: 16px;
  transform: translate(0px, 0);
  border: none;
  background-image: url(/data/arrowhead_right.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  image-rendering: pixelated;
`;

export const NextActionArrow = ({
  size = DEFAULT_SIZE,
  swept = false,
}: {
  size?: number;
  proxy?: Spell;
  swept?: boolean;
}) => {
  return (
    <>
      <LineDiv size={size} swept={swept} data-name="ArrowLine" />
      <ArrowHeadDiv data-name="ArrowHead" />
    </>
  );
};

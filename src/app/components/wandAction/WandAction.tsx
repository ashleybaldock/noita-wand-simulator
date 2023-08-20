import styled from 'styled-components/macro';
import { useState } from 'react';
import { actionTypeInfoMap } from '../../calc/extra/types';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';

export const DEFAULT_SIZE = 48;

const ImageBackgroundDiv = styled.div<{
  size: number;
  actionImgUrl: string;
  typeImgUrl?: string;
  mouseOver: boolean;
}>`
  position: relative;
  min-width: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-image: url(/${({ actionImgUrl }) => actionImgUrl})
    ${({ typeImgUrl }) => (typeImgUrl ? `, url(/${typeImgUrl})` : ``)};
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;

  &:hover {
    transform-origin: center;
    transform: scale(109%);
    transition: transform var(--anim-basic-in);
    cursor: move;
  }
`;

type Props = {
  size?: number;
  onDeleteSpell?: () => void;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function WandAction(props: Props) {
  const [mouseOver, setMouseOver] = useState(false);

  const size = props.size ?? DEFAULT_SIZE;

  if (!props.action) {
    return (
      <ImageBackgroundDiv
        size={size}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        actionImgUrl=""
        mouseOver={mouseOver}
      />
    );
  }

  return (
    <ImageBackgroundDiv
      size={size}
      actionImgUrl={props.action.sprite}
      typeImgUrl={actionTypeInfoMap[props.action.type]?.src}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      mouseOver={mouseOver}
    ></ImageBackgroundDiv>
  );
}

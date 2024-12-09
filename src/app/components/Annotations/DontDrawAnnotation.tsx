import styled from 'styled-components';
import { useConfig } from '../../redux';
import { BaseAnnotation } from './BaseAnnotation';
import type { ActionCall } from '../../calc/eval/ActionCall';

const DontDrawDiv = styled(BaseAnnotation)`
  left: calc(-1 * var(--sizes-spell-base) / 4 + 12px);
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
  color: #0000;
  font-size: 12px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

export const DontDrawAnnotation = (
  props: {
    dont_draw_actions?: boolean;
  } & Partial<ActionCall>,
) => {
  const { dont_draw_actions = false } = props;
  const { showDontDraw } = useConfig();

  if (!dont_draw_actions || !showDontDraw) {
    return null;
  }

  return <DontDrawDiv data-name="DrawDisabled">D⃠</DontDrawDiv>;
};

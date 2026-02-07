import styled from 'styled-components';
import { useConfig } from '../../redux';
import { BaseAnnotation } from './BaseAnnotation';
import type { ActionCall } from '../../calc/eval/ActionCall';

const StyledBaseAnnotation = styled(BaseAnnotation)`
  inset: 0;
  user-select: none;
  color: #0000;
  font-size: 12px;
  text-align: center;
  font-family: var(--font-family-noita-default);
  display: grid;
  grid-template: 1fr/1fr;
  grid-auto-flow: dense;
  place-content: center;
  place-items: center;
  align-items: center;
  align-content: center;
  letter-spacing: 0;
  background-color: var(--color-base-background);
  border-radius: 50%;
  max-height: 2em;
  overflow: visible;

  &::after {
    content: '\200b⃠';
    display: flex;
    grid-column: 1/-1;
    grid-row: 1/-1;
    place-self: center;
    color: red;
    font-size: 2em;
    line-height: normal;
    letter-spacing: 0;
    align-items: baseline;
    margin: 0 0.06ch 0.16em 0;
    line-height: 0;
    text-shadow:
      0.3px -0.3px 0 #000,
      -0.3px 0.3px 0 #000;
  }
  &::before {
    content: 'D';
    display: flex;
    grid-column: 1/-1;
    grid-row: 1/-1;
    place-self: center;
    color: #fff;
    line-height: 0;
    font-size: 1.3em;
    letter-spacing: 0ch;
    align-items: baseline;
  }
`;

export const DontDrawAnnotation = ({
  dont_draw_actions = false,
  className,
}: {
  dont_draw_actions?: boolean;
  className?: string;
} & Partial<ActionCall>) => {
  const { showDontDraw } = useConfig();

  if (!dont_draw_actions || !showDontDraw) {
    return null;
  }

  return (
    <StyledBaseAnnotation
      className={className}
      dataName="DontDrawAnnotation"
    ></StyledBaseAnnotation>
  );
};

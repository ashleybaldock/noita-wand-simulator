import styled from 'styled-components/macro';
import { Spell } from '../../calc/spell';
import { useResultsConfig } from '../../redux';
import { DEFAULT_SIZE } from '../../util';

const RecursionDiv = styled.div<{
  size: number;
}>`
  pointer-events: none;
  position: absolute;
  bottom: -7px;
  left: 0;
  width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #3bb;
  font-size: 10px;
  line-height: ${({ size }) => size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

const IterationDiv = styled.div<{
  size: number;
  offset: number;
}>`
  position: absolute;
  bottom: -7px;
  left: ${({ size, offset }) => (size * offset) / 4 + (offset > 0 ? 1 : 0)}px;
  width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #a5e;
  font-size: 10px;
  line-height: ${({ size }) => size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

type IterationAnnotationProps = {
  size?: number;
  spell: Spell;
  iteration?: 0;
};

type RecursionAnnotationProps = {
  size?: number;
  spell: Spell;
  recursion?: 0;
};
// export type ActionCall = {
// * spell: Spell;
//   source: ActionSource;
//   currentMana: number;
// * deckIndex?: string | number;
//   recursion?: number;
//   iteration?: number;
//   dont_draw_actions?: boolean;
// };

// export type GroupedProjectile = {
//   entity: string;
// * spell?: Spell;
//   proxy?: Spell;
//   trigger?: GroupedWandShot;
// * deckIndex?: string | number;
// };

export function IterationAnnotation(props: IterationAnnotationProps) {
  const { size = DEFAULT_SIZE, spell, iteration } = props;
  const { showIteration } = useResultsConfig();

  if (!showIteration || !spell.iterative) {
    return null;
  }

  return (
    <IterationDiv size={size} offset={0}>
      {iteration}
    </IterationDiv>
  );
}
export function RecursionAnnotation(props: RecursionAnnotationProps) {
  const { size = DEFAULT_SIZE, spell, recursion } = props;
  const { showRecursion } = useResultsConfig();

  if (!showRecursion || !spell.recursive) {
    return null;
  }

  return <RecursionDiv size={size}>{recursion}</RecursionDiv>;
}

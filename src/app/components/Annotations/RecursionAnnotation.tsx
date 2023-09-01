import styled from 'styled-components/macro';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';
import { isIterativeActionId } from '../../calc/actionId';
import { useConfig } from '../../redux';
import { DEFAULT_SIZE } from '../../util';
import { recursiveActionIds } from '../../calc/spells';

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

type Props = {
  size?: number;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function RecursionAnnotation(props: Props) {
  const { size = DEFAULT_SIZE, spell, recursion, iteration } = props;
  const { config } = useConfig();

  if (!config.showRecursion) {
    return null;
  }

  const recursive = spell && recursiveActionIds.includes(spell?.id);
  const iterative = spell && isIterativeActionId(spell?.id);

  const showRecursion =
    recursion !== undefined && (recursive || (iterative && recursion > 0));
  const showIteration = iteration !== undefined && iterative;

  return (
    <>
      {showRecursion && <RecursionDiv size={size}>{recursion}</RecursionDiv>}
      {showIteration && (
        <IterationDiv size={size} offset={showRecursion ? 1 : 0}>
          {iteration}
        </IterationDiv>
      )}
    </>
  );
}

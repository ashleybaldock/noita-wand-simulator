import styled from 'styled-components/macro';
import { ActionCall, GroupedProjectile } from '../../../calc/eval/types';
import { iterativeActions, recursiveActions } from '../../../calc/eval/lookups';
import { useAppSelector } from '../../../redux/hooks';
import { selectConfig } from '../../../redux/configSlice';

const DEFAULT_SIZE = 48;

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
  const { action, recursion, iteration } = props;
  const size = props.size ?? DEFAULT_SIZE;
  const { config } = useAppSelector(selectConfig);

  if (!config.showRecursion) {
    return null;
  }

  const recursive = action && recursiveActions().includes(action?.id);
  const iterative = action && iterativeActions().includes(action?.id);

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

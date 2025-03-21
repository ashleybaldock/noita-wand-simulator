import styled from 'styled-components/macro';
import { isIterativeActionId } from '../../calc/actionId';
import { useConfig } from '../../redux';
import { recursiveActionIds } from '../../calc/spells';
import { Spell } from '../../calc/spell';

const RecursionDiv = styled.div`
  pointer-events: none;
  position: absolute;
  bottom: -7px;
  left: 0;
  width: calc(var(--sizes-spell-base) / 4);
  height: calc(var(--sizes-spell-base) / 4);
  border: 1px solid #999;
  color: black;
  background-color: #3bb;
  font-size: 10px;
  line-height: calc(var(--sizes-spell-base) / 3 - 2px);
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

const IterationDiv = styled.div<{
  offset: boolean;
}>`
  position: absolute;
  bottom: -7px;
  left: ${({ offset }) =>
    offset ? `0` : `calc(var(--sizes-spell-base) / 4 + 1px)`};

  width: calc(var(--sizes-spell-base) / 4);
  height: calc(var(--sizes-spell-base) / 4);

  border: 1px solid #999;
  color: black;
  background-color: #a5e;
  font-size: 10px;
  line-height: calc(var(--sizes-spell-base) / 3 - 2px);
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

type Props = {
  size?: number;
  spell: Spell;
  recursion?: number;
  iteration?: number;
};

export function RecursionAnnotation(props: Props) {
  const { spell, recursion, iteration } = props;
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
      {showRecursion && <RecursionDiv>{recursion}</RecursionDiv>}
      {showIteration && (
        <IterationDiv offset={showRecursion ?? false}>{iteration}</IterationDiv>
      )}
    </>
  );
}

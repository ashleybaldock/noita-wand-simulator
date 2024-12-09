import styled from 'styled-components';
import { isIterativeActionId } from '../../calc/actionId';
import { useConfig } from '../../redux';
import { recursiveActionIds } from '../../calc/spells';
import type { SpellDeckInfo } from '../../calc/spell';

const RecursionDiv = styled.div`
  pointer-events: none;
  position: absolute;
  bottom: -7px;
  left: 0;
  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);
  border: 1px solid #999;
  color: #fff;
  background-color: #3bb;
  font-size: 10px;
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

const IterationDiv = styled.div<{
  $offset: boolean;
}>`
  position: absolute;
  bottom: -7px;
  left: ${({ $offset }) =>
    $offset ? `0` : `calc(var(--bsize-spell) / 4 + 1px)`};

  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);

  border: 1px solid #999;
  color: #fff;
  background-color: #a5e;
  font-size: 10px;
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

export const RecursionAnnotation = (props: {
  size?: number;
  spell: SpellDeckInfo;
  recursion?: number;
  iteration?: number;
}) => {
  const { spell, recursion, iteration } = props;
  const { showRecursion: configShowRecursion } = useConfig();

  if (!configShowRecursion) {
    return null;
  }

  const recursive = spell && recursiveActionIds.includes(spell?.id);
  const iterative = spell && isIterativeActionId(spell?.id);

  const showRecursion =
    recursion !== undefined && (recursive || (iterative && recursion > 0));
  const showIteration = iteration !== undefined && iterative;

  return (
    <>
      {showRecursion && (
        <RecursionDiv data-name="Recursion">{recursion}</RecursionDiv>
      )}
      {showIteration && (
        <IterationDiv data-name="Iteration" $offset={showRecursion ?? false}>
          {iteration}
        </IterationDiv>
      )}
    </>
  );
};

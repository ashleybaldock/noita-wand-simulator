import styled from 'styled-components';
import { useConfig } from '../../redux';
import type { Spell } from '../../calc/spell';
import { StyledKeyContainer } from '../Key/Key';

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

  ${StyledKeyContainer} & {
    position: relative;
    inset: unset;
    transform: none;
  }
`;
export const RecursionAnnotation = (props: {
  size?: number;
  spell: Spell;
  recursion?: number;
  iteration?: number;
}) => {
  const { spell, recursion } = props;
  const { showRecursion: configShowRecursion } = useConfig();

  if (!configShowRecursion) {
    return null;
  }

  const recursive = spell?.recursive ?? false;

  return configShowRecursion && recursive ? (
    <RecursionDiv data-name="Recursion">{recursion}</RecursionDiv>
  ) : null;
};

import { isIterativeActionId } from '../../calc/actionId';
import type { SpellDeckInfo } from '../../calc/spell';
import styled from 'styled-components';
import { StyledKeyContainer } from '../Key/Key';

// export const IterationAnnotationOld = ({
//   iteration,
//   limit = 5,
//   children,
//   style,
//   className = '',
// }: {
//   iteration: number;
//   limit?: number;
//   style?: string;
//   className?: string;
// } & PropsWithChildren) => {
//   return <div className={className}>{children}</div>;
// };

export const IterationDiv = styled.div`
  position: absolute;
  bottom: -7px;

  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);

  border: 1px solid #999;
  color: #fff;
  background-color: #a5e;
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

export const IterationAnnotation = ({
  spell,
  iteration,
}: {
  spell: SpellDeckInfo;
  iteration?: number;
}) => {
  const iterative = spell && isIterativeActionId(spell?.id);

  const showIteration = iteration !== undefined && iterative;

  return showIteration ? (
    <IterationDiv data-name="Iteration">{iteration}</IterationDiv>
  ) : null;
};

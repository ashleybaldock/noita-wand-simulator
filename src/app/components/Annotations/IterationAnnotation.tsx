import styled from 'styled-components';
import {_KeyContainer} from '../Key/Key';
import {useConfig} from '../../redux';
import {BaseAnnotation} from './BaseAnnotation';

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

const Iteration = styled.div``;

const Limit = styled.div``;

const StyledBaseAnnotation = styled(BaseAnnotation)`
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

  ${_KeyContainer} & {
    position: relative;
    inset: unset;
    transform: none;
  }
`;

export const IterationAnnotation = ({
  iterative = false,
  limit,
  iteration,
}: {
  iterative?: boolean;
  limit?: number;
  iteration?: number;
}) => {
  const {showIteration: configShowIteration} = useConfig();

  return (
    <StyledBaseAnnotation
      hidden={!iterative || !configShowIteration}
      data-name="IterationAnnotation"><Iteration>{iteration}</Iteration><Limit>{limit}</Limit></StyledBaseAnnotation >
  );
};

import styled from 'styled-components';
import { useConfig } from '../../redux';
import { _KeyContainer } from '../Key/Key';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)`
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

  ${_KeyContainer} & {
  }
`;
export const RecursionAnnotation = ({
  recursive = false,
  recursion,
}: {
  recursive?: boolean;
  recursion?: number;
}) => {
  const { showRecursion: configShowRecursion } = useConfig();

  if (!configShowRecursion) {
    return null;
  }

  return (
    <StyledBaseAnnotation
      hidden={!recursive || !configShowRecursion}
      dataName="RecursionAnnotation"
    >
      {recursion}
    </StyledBaseAnnotation>
  );
};

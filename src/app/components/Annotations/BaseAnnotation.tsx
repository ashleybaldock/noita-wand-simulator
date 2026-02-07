import styled, { type DataAttributes } from 'styled-components';
import { isAnnotationTooltipId } from '../Tooltips/AnnotationTooltip';
import { tipToAttributes, type Tip } from '../Tooltips/tooltipId';
import type { PropsWithChildren } from 'react';

const StyledDiv = styled.div`
  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;
`;
const _BaseAnnotation = ({
  dataName = 'BaseAnnotation',
  className,
  tip,
  children,
}: {
  dataName?: string;
  tip?: Tip;
  className?: string;
} & DataAttributes &
  PropsWithChildren) => {
  return (
    <StyledDiv
      data-name={dataName}
      className={className}
      {...((tip ?? isAnnotationTooltipId(dataName))
        ? tipToAttributes({ kind: 'annotation', id: dataName })
        : {})}
    >
      {children}
    </StyledDiv>
  );
};

export const BaseAnnotation = styled(_BaseAnnotation)``;

import styled from 'styled-components';
import {
  isAnnotationTooltipId,
  type AnnotationTip,
} from '../Tooltips/AnnotationTooltip';
import { tipToAttributes, type Tip } from '../Tooltips/tooltipId';

export const BaseAnnotation = styled.div.attrs<{
  $dataName?: string;
  tip?: Tip;
}>(
  ({
    $dataName = 'BaseAnnotation',
    tip = {
      kind: 'annotation',
      id: isAnnotationTooltipId($dataName) ? $dataName : null,
    } as AnnotationTip as Tip,
  }) => ({
    'data-name': $dataName,
    ...tipToAttributes(tip),
  }),
)`
  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;
`;

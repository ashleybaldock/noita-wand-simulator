import type { WandCastResult } from '../../../calc/eval/WandCastResult';
import { CastTableHeadings } from './CastTableHeadings';
import { CastTableColumns } from './CastTableColumns';
import { castTableGridRows } from './ShotTableRowConfig';

import styled from 'styled-components';

export const StyledCastTable = styled.div.attrs<{ 'data-name'?: string }>(
  () => ({ 'data-name': 'CastTable' }),
)<{ $rows?: string }>`
  --nesting-offset: var(--sizes-nesting-offset, 16px);

  display: grid;
  gap: 0;
  grid-auto-flow: column dense;
  grid-template-columns:
    [left labels-start] 150px [labels-end icons-start] 20px [icons-end shots-start] repeat(
      auto-fit,
      minmax(80px, 1fr)
    )
    [shots-end right];
  grid-template-rows:
    [heading] min-content
    ${(props) => props.$rows};

  margin: 0.1em 0em 0.4em 0em;
`;

export const Headings = styled.div`
  display: contents;
  grid-row: heading;
  grid-column: left / right;
`;

export const CastTable = ({
  $castIndex,
  $cast,
}: {
  $castIndex: number;
  $cast: WandCastResult;
}) => {
  return (
    <StyledCastTable $rows={castTableGridRows()}>
      <CastTableHeadings
        $castIndex={$castIndex}
        $castId={$cast.id}
      ></CastTableHeadings>
      <CastTableColumns $castId={$cast.id}></CastTableColumns>
    </StyledCastTable>
  );
};

import type { WandCastResult } from '../../../calc/eval/WandCastResult';
import { CastTableHeadings } from './CastTableHeadings';
import { CastTableColumns } from './CastTableColumns';
import { castTableGridRows } from './ShotTableRowConfig';

import styled from 'styled-components';

export const StyledCastTable = styled.div.attrs<{ 'data-name'?: string }>(
  () => ({ 'data-name': 'CastTable' }),
)<{ $rows?: string }>`
  --nesting-offset: var(--sizes-nesting-offset, 16px);
  --colw: minmax(min(80px, 100%), 1fr);

  display: grid;
  gap: 0;
  grid-auto-flow: column dense;
  grid-template-columns:
    [left labels-start] 150px [labels-end icons-start] 20px [icons-end totals-start] var(
      --colw
    )
    [totals-end wand-start] var(--colw)
    [wand-end scopes-start] auto [scopes-end right];
  grid-template-rows:
    [heading] min-content
    ${(props) => props.$rows};

  margin: 0.1em 0 0.4em 0;

  & > * {
    display: contents;
  }
`;

export const Headings = styled.div`
  display: contents;
  grid-row: heading;
  grid-column: left / right;
`;

export const CastTable = ({
  castIndex,
  cast,
}: {
  castIndex: number;
  cast: WandCastResult;
}) => {
  // const cast = useCast($cast.id);
  // const castTableGridCols = useMemo(() => {
  //   const colw = '--colw: minmax(min(80px, 100%), 1fr);';
  //   const base = `[left labels-start] 150px [labels-end icons-start] 20px [icons-end totals-start] var(--colw) [totals-end wand-start] var(--colw) [wand-end scopes-start] auto [scopes-end right]`;
  // }, [cast, $castIndex]);

  return (
    <StyledCastTable $rows={castTableGridRows()}>
      <CastTableHeadings castIndex={castIndex} cast={cast}></CastTableHeadings>
      <CastTableColumns cast={cast}></CastTableColumns>
    </StyledCastTable>
  );
};

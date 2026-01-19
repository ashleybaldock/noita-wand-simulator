import type { WandCastResult } from '../../../calc/eval/WandCastResult';
import {
  StyledCastTable,
  CastTableHeadings,
  CastTableColumns,
} from './ShotTable';
import { castTableGridRows } from './ShotTableRowConfig';

export const CastTable = ({
  castIndex,
  cast,
}: {
  castIndex: number;
  cast: WandCastResult;
}) => {
  return (
    <StyledCastTable $rows={castTableGridRows()}>
      <CastTableHeadings
        castIndex={castIndex}
        castId={cast.id}
      ></CastTableHeadings>
      <CastTableColumns castId={cast.id}></CastTableColumns>
    </StyledCastTable>
  );
};

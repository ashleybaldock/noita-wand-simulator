import styled from 'styled-components';
import {
  FieldNamesColumn,
  IconsColumn,
  ProjectileColumn,
  SubTotalsColumn,
  TotalsColumn,
  WandStatsColumn,
} from './CastStateColumn';
import { isNotNullOrUndefined, NBSP } from '../../../util';
import {
  IconsColumnHeading,
  ProjectileHeading,
  CastIndexColumnHeading,
  SubTotalsColumnHeading,
  TotalsColumnHeading,
  WandStatsColumnHeading,
} from './ColumnHeading';
import { Fragment } from 'react';
import type { WandCastId } from '../../../calc/eval/WandCast';
import { useCast, useCastLookup } from '../../../redux';
import type { WandCastProjectile } from '../../../calc/eval/WandCastProjectile';
import { CastTableProjectile } from './CastTableProjectile';

export const StyledCastTable = styled.div<{ $rows?: string }>`
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

const Headings = styled.div`
  display: contents;
  grid-row: heading;
  grid-column: left / right;
`;

// const castSubStateSummary = useMemo(() => {
/*
 * S:[a b:[  3       4          ]
 *         i j:[   ] k:[       ]
 *             [x y]   [p q r s]
 * 2  0 3  0 3  0 0  4  0 0 0 0
 * 1+(10)
 *    1 1(+8)
 *         1 1(+2)   1(+4)
 *
 * For each shot, get:
 *   * count of (grouped) projectiles inside each projectile's trigger
 *   * And the number of items to display to the right of it
 * And construct a line diagram template:
 *
 *       a╶╴b╶╴i╶╴j╶╴x╶╴y╶╴k╶╴p╶╴q╶╴r╶╴s╶╴c
 *
 *   ⓧ   a╶╴b╶───────────────────────────╴c  ⎕  ⎕  ⎕
 *   ⓨ   ⎕  └─╴i╶╴j╶──────╴k  ⎕  ⎕  ⎕  ⎕  └─╴l  ⎕  ⎕
 *   ⓨ   ⎕  ⎕  ⎕  └─╴x╶╴y  └─╴p╶╴q╶╴r╶╴s  ⎕  ┕─╴t╶╴u
 *
 *
 *   ⓧ  ⎣1,⎣1,⎜1 ⎜1  1  1⎟ 1⎤⎡1⎤⎡1⎤⎡1⎤⎡1⎤⎜1⎤
 *            ⎣1,⎜1  1  1⎟ 1⎟⎜0⎟⎜0⎟⎜0⎟⎜0⎟⎣0⎦⎣0⎦
 *               ⎣1  1  1⎦ 1⎦⎣1⎦⎣1⎦⎣1⎦⎣1⎦⎣ ⎦⎣
 *       a╶╴b╶╴i╶╴j╶╴x╶╴y╶╴k╶╴p╶╴q╶╴r╶╴s╶╴c
 *
 *   ⓧ   a--b:[1,⎡1⎤⎡0⎤⎡0⎤⎡0⎤⎡0⎤⎡0⎤⎡0⎤⎡0⎤⎡0⎤⎡0⎤
 *          ⬇︎    ⎜1⎟⎜1⎟⎜1⎟⎜1⎟⎜0⎟⎜1⎟⎜0⎟⎜0⎟⎣0⎦⎣0⎦
 *          ⬇︎    ⎣1⎦⎣0⎦⎣1⎦⎣1⎦⎣0⎦⎣1⎦⎣1⎦⎣1⎦
 *   ⓨ      🄒 -i╶╴j[1,1]-╴k:[1,[0,[0,[0,[0,
 *              ⬇︎ ^[1,1][0]⬇︎ ^ 1] 1] 1] 1] 1]       Pass down: prefix, includes
 *   ⓩ            🄒 x--y         🄒 p--q--r--s
 *                  ^  ^           ^  ^  ^  ^         (trturn
 *                 [1,[1,       [ [0,[0,[0,[0,
 *                  1] 1]          1] 1] 1] 1] ]
 * [[1[1[0[0 0 0 0 0 0 0 0],
 *   0 1 1 3 1 1 5 0 0 0 0]
 *   0]0]0]1]1 1 1 1 1 1 1]
 *
 *   2d Array                         N:1, L:0
 *  ⎡[1,[1,[1,[1,[1,[1,[1,[1,[0,[0,⎤   1:N➤➤➤1:N➤1...1
 *  ⎢ 1] 1, 1, 1, 1, 0, 0, 1] 1, 1]⎥   1:L➤0 1:N➤1...1
 *  ⎢    1, 0, 0, 1, 0, 0,    1]   ⎥         1:L➤0...0
 *  ⎣    1] 1] 1] 1] 1] 1]         ⎦         1:N➤1:N➤1:L➤1:
 *  * depth-first inorder traversal
 *  * upper levels padded with zero
 *  * then that can be overwritten if needed by later levels
 *      [1]     a
 *    [1,1]   i b
 *  [1,1,1] x j
 *  [1,1,1] y
 *  [1,1,1] p k
 *  [1,1,1] q
 *  [1,1,1] r
 *  [1,1,1] s
 */

export const CastTableHeadings = ({
  castIndex,
  castId,
  nestingPrefix = [],
}: {
  castIndex: number;
  castId: WandCastId;
  nestingPrefix?: Array<number>;
}) => {
  const cast = useCast(castId);
  if (!cast) {
    return null;
  }
  const { triggerType, projectiles } = cast;
  const castLookup = useCastLookup();

  return (
    <Headings>
      {nestingPrefix.length === 0 ? (
        <>
          <CastIndexColumnHeading
            data-name={'IndexHeading'}
            index={castIndex}
            nestingPrefix={nestingPrefix}
          >
            {castIndex}
          </CastIndexColumnHeading>
          <IconsColumnHeading
            data-name={'IconHeading'}
            nestingPrefix={nestingPrefix}
          >
            {''}
          </IconsColumnHeading>
          <TotalsColumnHeading
            data-name={'TotalHeading'}
            origin={true}
            nestingPrefix={nestingPrefix}
          >
            {`Cast${NBSP}Totals`}
          </TotalsColumnHeading>
          <WandStatsColumnHeading
            data-name={'WandHeading'}
            nestingPrefix={nestingPrefix}
          >
            {`Wand Stats`}
          </WandStatsColumnHeading>
        </>
      ) : (
        <>
          <SubTotalsColumnHeading
            data-name={'SubTotalHeading'}
            nestingPrefix={[...nestingPrefix, 1]}
            triggerType={triggerType}
          >
            {`Payload${NBSP}Totals`}
          </SubTotalsColumnHeading>
        </>
      )}
      {projectiles.map((projectile: WandCastProjectile, index, arr) => {
        const isEndOfTrigger = index === arr.length - 1;
        const triggerCast = ((lookupResult) =>
          ((lookupResult?.projectiles?.length ?? 0) > 0 && lookupResult) ||
          undefined)(castLookup.get(projectile?.payload ?? -1));
        const isStartOfTrigger = isNotNullOrUndefined(triggerCast);

        return (
          <Fragment key={index}>
            <ProjectileHeading
              isStartOfTrigger={isStartOfTrigger}
              isEndOfTrigger={isEndOfTrigger}
              nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
            >
              <CastTableProjectile projectile={projectile} />
            </ProjectileHeading>
            {isNotNullOrUndefined(triggerCast) && (
              <CastTableHeadings
                castId={triggerCast.id}
                castIndex={index}
                nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
              />
            )}
          </Fragment>
        );
      })}
    </Headings>
  );
};

export const CastTableColumns = ({
  castId,
  nestingPrefix = [],
}: {
  castId: WandCastId;
  nestingPrefix?: Array<number>;
}) => {
  const cast = useCast(castId);
  if (!cast) {
    return null;
  }
  const { castState, manaDrain, triggerType, projectiles } = cast;
  const castLookup = useCastLookup();

  return (
    <>
      {nestingPrefix.length === 0 ? (
        <>
          <FieldNamesColumn castState={castState} />
          <IconsColumn castState={castState} />
          <TotalsColumn castState={castState} manaDrain={manaDrain} />
          <WandStatsColumn castState={castState} />
        </>
      ) : (
        <>
          <SubTotalsColumn
            triggerType={triggerType}
            castState={castState}
            manaDrain={manaDrain}
          />
        </>
      )}
      {projectiles.map((projectile, index, arr) => {
        const isEndOfTrigger = index === arr.length - 1;
        const triggerCast = ((lookupResult) =>
          ((lookupResult?.projectiles?.length ?? 0) > 0 && lookupResult) ||
          undefined)(castLookup.get(projectile?.payload ?? -1));

        return (
          <Fragment key={index}>
            <ProjectileColumn
              castState={castState}
              manaDrain={manaDrain}
              insideTrigger={true}
            />
            {isNotNullOrUndefined(triggerCast) && (
              <CastTableColumns
                castId={triggerCast.id}
                nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

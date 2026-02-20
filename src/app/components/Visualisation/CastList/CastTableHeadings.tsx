import { Fragment } from 'react';
import { isNotNullOrUndefined } from '../../../util';
import { CastTableProjectile } from './CastTableProjectile';
import {
  CastIndexColumnHeading,
  IconsColumnHeading,
  TotalsColumnHeading,
  WandStatsColumnHeading,
  SubTotalsColumnHeading,
  ProjectileHeading,
} from './ColumnHeading';
import { Headings } from './CastTable';
import { useGroupedProjectiles } from './useGroupedProjectiles';
import type { WandCastResult } from '../../../calc/eval/WandCastResult';
import { useCastLookup } from '../../../redux';

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
  cast,
  nestingPrefix = [],
}: {
  castIndex: number;
  cast: WandCastResult;
  nestingPrefix?: Array<number>;
}) => {
  const castLookup = useCastLookup();

  const { triggerType, projectiles } = cast;
  const { triggerProjectiles, projectilesWithGroupedCounts } =
    useGroupedProjectiles(projectiles);
  return cast ? (
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
            {`Total`}
          </TotalsColumnHeading>
          <WandStatsColumnHeading
            data-name={'WandHeading'}
            nestingPrefix={nestingPrefix}
          >
            {`Wand`}
          </WandStatsColumnHeading>
        </>
      ) : (
        <>
          <SubTotalsColumnHeading
            data-name={'SubTotalHeading'}
            nestingPrefix={[...nestingPrefix, 1]}
            triggerType={triggerType}
          >
            {`Payload Total`}
          </SubTotalsColumnHeading>
        </>
      )}
      {projectilesWithGroupedCounts.map(([projectile, count], index, arr) => {
        const isEndOfTrigger = index === arr.length - 1;

        return (
          <ProjectileHeading
            key={index}
            isEndOfTrigger={isEndOfTrigger}
            nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
          >
            <CastTableProjectile projectile={projectile} count={count} />
          </ProjectileHeading>
        );
      })}
      {triggerProjectiles.map((projectile, index, arr) => {
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
              <CastTableProjectile projectile={projectile} count={1} />
            </ProjectileHeading>
            {isNotNullOrUndefined(triggerCast) && (
              <CastTableHeadings
                cast={triggerCast}
                castIndex={index}
                nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
              />
            )}
          </Fragment>
        );
      })}
    </Headings>
  ) : null;
};

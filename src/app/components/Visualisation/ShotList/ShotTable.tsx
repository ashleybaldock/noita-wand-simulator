import styled from 'styled-components';
import {
  FieldNamesColumn,
  IconsColumn,
  ProjectileColumn,
  SubTotalsColumn,
  TotalsColumn,
} from './CastStateColumn';
import { isNotNullOrUndefined, NBSP } from '../../../util';
import {
  IconsColumnHeading,
  ProjectileHeading,
  ShotIndexColumnHeading,
  SubTotalsColumnHeading,
  TotalsColumnHeading,
} from './ColumnHeading';
import { Fragment } from 'react';
import type { WandShotId } from '../../../calc/eval/WandShot';
import { useShot, useShotLookup } from '../../../redux';
import type { ShotProjectile } from '../../../calc/eval/ShotProjectile';
import { ShotTableProjectile } from './ShotTableProjectile';
import type { WandShotResult } from '../../../calc/eval/WandShot';
import { shotTableGridRows } from './ShotTableRowConfig';

const StyledShotTable = styled.div<{ $rows?: string }>`
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

// const shotSubStateSummary = useMemo(() => {
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

export const ShotTableHeadings = ({
  shotIndex,
  shotId,
  nestingPrefix = [],
}: {
  shotIndex: number;
  shotId: WandShotId;
  nestingPrefix?: Array<number>;
}) => {
  const shot = useShot(shotId);
  if (!shot) {
    return null;
  }
  const { triggerType, projectiles } = shot;
  const shotLookup = useShotLookup();

  return (
    <Headings>
      {nestingPrefix.length === 0 ? (
        <>
          <ShotIndexColumnHeading
            index={shotIndex}
            nestingPrefix={nestingPrefix}
          >
            {shotIndex}
          </ShotIndexColumnHeading>
          <IconsColumnHeading nestingPrefix={nestingPrefix}>
            {''}
          </IconsColumnHeading>
          <TotalsColumnHeading origin={true} nestingPrefix={nestingPrefix}>
            {`Shot${NBSP}Totals`}
          </TotalsColumnHeading>
        </>
      ) : (
        <>
          <SubTotalsColumnHeading
            nestingPrefix={[...nestingPrefix, 1]}
            triggerType={triggerType}
          >
            {`Payload${NBSP}Totals`}
          </SubTotalsColumnHeading>
        </>
      )}
      {projectiles.map((projectile: ShotProjectile, index, arr) => {
        const isEndOfTrigger = index === arr.length - 1;
        const triggerShot = ((lookupResult) =>
          ((lookupResult?.projectiles?.length ?? 0) > 0 && lookupResult) ||
          undefined)(shotLookup.get(projectile?.trigger ?? -1));
        const isStartOfTrigger = isNotNullOrUndefined(triggerShot);

        return (
          <Fragment key={index}>
            <ProjectileHeading
              isStartOfTrigger={isStartOfTrigger}
              isEndOfTrigger={isEndOfTrigger}
              nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
            >
              <ShotTableProjectile projectile={projectile} />
            </ProjectileHeading>
            {isNotNullOrUndefined(triggerShot) && (
              <ShotTableHeadings
                shotId={triggerShot.id}
                shotIndex={index}
                nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
              />
            )}
          </Fragment>
        );
      })}
    </Headings>
  );
};

export const ShotTableColumns = ({
  shotId,
  nestingPrefix = [],
}: {
  shotId: WandShotId;
  nestingPrefix?: Array<number>;
}) => {
  const shot = useShot(shotId);
  if (!shot) {
    return null;
  }
  const { castState, manaDrain, triggerType, projectiles } = shot;
  const shotLookup = useShotLookup();

  return (
    <>
      {nestingPrefix.length === 0 ? (
        <>
          <FieldNamesColumn castState={castState} />
          <IconsColumn castState={castState} />
          <TotalsColumn castState={castState} manaDrain={manaDrain} />
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
        const triggerShot = ((lookupResult) =>
          ((lookupResult?.projectiles?.length ?? 0) > 0 && lookupResult) ||
          undefined)(shotLookup.get(projectile?.trigger ?? -1));
        // const isStartOfTrigger = isNotNullOrUndefined(triggerShot);

        return (
          <Fragment key={index}>
            <ProjectileColumn
              castState={castState}
              manaDrain={manaDrain}
              insideTrigger={true}
            />
            {isNotNullOrUndefined(triggerShot) && (
              <ShotTableColumns
                shotId={triggerShot.id}
                nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export const ShotTable = ({
  shotIndex,
  shot,
}: {
  shotIndex: number;
  shot: WandShotResult;
}) => {
  return (
    <StyledShotTable $rows={shotTableGridRows()}>
      <ShotTableHeadings
        shotIndex={shotIndex}
        shotId={shot.id}
      ></ShotTableHeadings>
      <ShotTableColumns shotId={shot.id}></ShotTableColumns>
    </StyledShotTable>
  );
};

import styled from 'styled-components';
import {
  FieldNamesColumn,
  IconsColumn,
  ProjectileColumn,
  SubTotalsColumn,
  TotalsColumn,
} from './CastStateColumn';
import { ProjectileActionGroup } from './ProjectileActionGroup';
import { isNotNullOrUndefined, NBSP } from '../../../util';
import {
  IconsColumnHeading,
  ProjectileHeading,
  ShotIndexColumnHeading,
  SubTotalsColumnHeading,
  TotalsColumnHeading,
} from './ColumnHeading';
import { Fragment } from 'react';
import type { WandShot, WandShotId } from '../../../calc/eval/WandShot';
import { useResult } from '../../../redux';
import type { ShotProjectile } from '../../../calc/eval/ShotProjectile';

const StyledShotTable = styled.div`
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
    [timing] repeat(5, min-content)
    [motion] repeat(6, min-content)
    [crit] repeat(6, min-content)
    [damage] repeat(15, min-content)
    [impact] repeat(5, min-content)
    [material] repeat(4, min-content);

  margin: 0.1em 0em 0.4em 0em;
`;

const Headings = styled.div`
  display: contents;
  grid-row: heading;
  grid-column: left / right;
`;

// const shotSubStateSummary = useMemo(() => {
/*
 * For each shot, get count of (grouped) projectiles inside each projectile's trigger
 * S:[a b:[  3       4          ]
 *         i j:[   ] k:[       ]
 *             [x y]   [p q r s]
 * 2  0 3  0 3  0 0  4  0 0 0 0
 * 1+(10)
 *    1 1(+8)
 *         1 1(+2)   1(+4)
 * And the number of items to display to the right of it
 * And construct a line diagram template:
 *           b--i--j--x--y--k--p--q--r--s
 *
 * ⓧ:   a-b:[1,[1,[0,[0,[0,[0,[0,[0,[0,[0,[0
 *      ⬇︎    1, 1, 1, 1, 0, 1, 0, 0, 0, 0]
 *      ⬇︎    1] 0] 1] 1] 0] 1] 1] 1]
 *      ⬇︎
 * ⓨ    🄒 -----i---j-[1,1]--k:[1,[0,[0,[0,[0,
 *                ⬇︎ ^[1,1][0]⬇︎ ^ 1] 1] 1] 1] 1]       Pass down: prefix, includes
 * ⓩ              🄒 x--y         🄒 p--q--r--s
 *                  ^  ^           ^  ^  ^  ^
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
 *
 */
// type SubResult = number[] | SubResult[];
// const getSubShotSummary = (
//   projectiles: Array<GroupedObject<GroupedProjectile>>,
//   prefix: Array<number> = [],
// ): Array<number> => {
//   return projectiles.flatMap(
//     (projectile: GroupedObject<GroupedProjectile>, i, arr) => {
//       const isFirst = i === 0;
//       const isLast = i === arr.length - 1;
//       if (
//         isRawObject<GroupedProjectile>(projectile) &&
//         projectile.trigger &&
//         projectile.trigger.projectiles.length > 0
//       ) {
//         return getSubShotSummary(projectile.trigger.projectiles, [
//           ...prefix,
//           1,
//         ]);
//       } else {
//         return [...prefix, 1];
//       }
//     },
//   );
// };
// }, [projectiles]);

// console.log(shotSubStateSummary);

export const ShotTableHeadings = ({
  shotIndex,
  shotId,
  nestingPrefix = [],
}: {
  shotIndex: number;
  shotId: WandShotId;
  nestingPrefix?: Array<number>;
}) => {
  const { shotLookup } = useResult();
  const shot = shotLookup.get(shotId);
  if (!shot) {
    return null;
  }
  const { castState, manaDrain, triggerType, projectiles } = shot;

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
              <ProjectileActionGroup group={projectile} />
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
  shotIndex,
  shotId,
  nestingPrefix = [],
}: {
  shotIndex: number;
  shotId: WandShotId;
  nestingPrefix?: Array<number>;
}) => {
  const { shotLookup } = useResult();
  const shot = shotLookup.get(shotId);
  if (!shot) {
    return null;
  }
  const { castState, manaDrain, triggerType, projectiles } = shot;

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
                shotIndex={index}
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
  shot: WandShot;
}) => {
  return (
    <StyledShotTable>
      <ShotTableHeadings
        shotIndex={shotIndex}
        shotId={shot.id}
      ></ShotTableHeadings>
      <ShotTableColumns
        shotIndex={shotIndex}
        shotId={shot.id}
      ></ShotTableColumns>
    </StyledShotTable>
  );
};

import styled from 'styled-components';
import {
  FieldNamesColumn,
  IconsColumn,
  ProjectileColumn,
  SubTotalsColumn,
  TotalsColumn,
} from './CastStateColumn';
import { ProjectileActionGroup } from './ProjectileActionGroup';
import { GroupedProjectile, GroupedWandShot } from '../../../calc/eval/types';
import { isNotNullOrUndefined, NBSP } from '../../../util';
import {
  GroupedObject,
  isRawObject,
} from '../../../calc/grouping/combineGroups';
import {
  IconsColumnHeading,
  ProjectileHeading,
  ShotIndexColumnHeading,
  SubTotalsColumnHeading,
  TotalsColumnHeading,
} from './ColumnHeading';
import { Fragment, useMemo } from 'react';

const StyledShotTable = styled.div`
  --nesting-offset: var(--sizes-nesting-offset, 16px);

  display: grid;
  gap: 0;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  grid-template-rows:
    [heading] min-content
    [timing] repeat(5, min-content)
    [motion] repeat(6, min-content)
    [crit] repeat(6, min-content)
    [damage] repeat(15, min-content)
    [impact] repeat(5, min-content)
    [material] repeat(5, min-content);
  grid-row: heading;

  margin: 0.1em 0em 0.4em 0em;
  border: 1px solid rgba(255, 0, 0, 0.3);
`;

export const ShotTableColumns = ({
  shotIndex,
  shot: { castState, manaDrain, triggerType, projectiles },
  nestingPrefix = [],
}: {
  shotIndex: number;
  shot: GroupedWandShot;
  nestingPrefix?: Array<number>;
}) => {
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

  return (
    <>
      {nestingPrefix.length === 0 ? (
        <>
          <ShotIndexColumnHeading
            index={shotIndex}
            nestingPrefix={nestingPrefix}
          >
            {shotIndex}
          </ShotIndexColumnHeading>
          <FieldNamesColumn castState={castState} />
          <IconsColumnHeading nestingPrefix={nestingPrefix}>
            {''}
          </IconsColumnHeading>
          <IconsColumn castState={castState} />
          <TotalsColumnHeading origin={true} nestingPrefix={nestingPrefix}>
            {`Shot${NBSP}Totals`}
          </TotalsColumnHeading>
          <TotalsColumn castState={castState} manaDrain={manaDrain} />
        </>
      ) : (
        <>
          <SubTotalsColumnHeading
            nestingPrefix={[...nestingPrefix, 1]}
            triggerType={triggerType}
          >
            {`Payload${NBSP}Totals`}
          </SubTotalsColumnHeading>
          <SubTotalsColumn
            triggerType={triggerType}
            castState={castState}
            manaDrain={manaDrain}
          />
        </>
      )}
      {projectiles.map(
        (projectile: GroupedObject<GroupedProjectile>, index, arr) => {
          const isEndOfTrigger = index === arr.length - 1;
          const triggerShot =
            (isRawObject<GroupedProjectile>(projectile) &&
              projectile.trigger &&
              projectile.trigger.projectiles.length > 0 &&
              projectile.trigger) ||
            undefined;
          const isStartOfTrigger = isNotNullOrUndefined(triggerShot);

          return (
            <Fragment key={index}>
              <ProjectileHeading
                branch={isStartOfTrigger}
                endpoint={isEndOfTrigger}
                nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
              >
                <ProjectileActionGroup group={projectile} />
              </ProjectileHeading>
              <ProjectileColumn
                castState={castState}
                manaDrain={manaDrain}
                insideTrigger={true}
              />
              {isNotNullOrUndefined(triggerShot) && (
                <ShotTableColumns
                  shot={triggerShot}
                  shotIndex={index}
                  nestingPrefix={[...nestingPrefix, isEndOfTrigger ? 0 : 1]}
                />
              )}
            </Fragment>
          );
        },
      )}
    </>
  );
};

export const ShotTable = ({
  shotIndex,
  shot,
}: {
  shotIndex: number;
  shot: GroupedWandShot;
}) => {
  return (
    <StyledShotTable>
      <ShotTableColumns shotIndex={shotIndex} shot={shot}></ShotTableColumns>
    </StyledShotTable>
  );
};

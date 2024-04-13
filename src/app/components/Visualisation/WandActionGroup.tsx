import styled from 'styled-components';
import { NextActionArrow } from '../Visualisation/Arrows';
import { DEFAULT_SIZE } from '../../util/constants';
import {
  ActionProxyAnnotation,
  ActionSourceAnnotation,
  DeckIndexAnnotation,
  DontDrawAnnotation,
  DrawAnnotation,
  FriendlyFireAnnotation,
  RecursionAnnotation,
} from '../Annotations/';
import { WrapAnnotation } from '../Annotations/WrapAnnotation';
import { WandAction, WandActionBorder } from '../Spells/WandAction';
import type { ActionCall } from '../../calc/eval/ActionCall';
import { getSpellById } from '../../calc/spells';
import { echo } from '../../util';
import type { ShotProjectile } from '../../calc/eval/ShotProjectile';

const isArrayObject = (_: unknown) => false;
const isMultipleObject = (_: unknown) => false;
const isRawObject = (_: unknown) => true;
const simplifyMultipleObject = echo;

const MainDiv = styled.div.attrs({
  className: 'MainDiv',
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
`;

const GroupDiv = styled.div.attrs({
  className: 'GroupDiv',
})`
  display: flex;
  flex-direction: row;
`;

const CountParentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CountDiv = styled.div<{
  size: number;
}>`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  color: white;
  background-color: black;
  height: ${({ size }) => size / 3}px;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  border: 1px solid #aaa;
  line-height: ${({ size }) => size / 3}px;
  font-family: var(--font-family-noita-default);
`;

const SpacerDiv = styled.div<{
  size: number;
}>`
  display: flex;
  flex: 1 1 auto;
  min-width: 5px;
  max-width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
`;
/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const WandActionGroupWandActionBorder = styled(WandActionBorder)`
  padding: 3px;
  border: 3px dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: rgba(108, 76, 34, 0.1);
  margin: 4px 0 4px var(--col-spacing, 48px);
  position: relative;
`;

export const WandActionGroup = ({
  size = DEFAULT_SIZE,
  group,
}: {
  size?: number;
  group: ActionCall | ShotProjectile;
}) => {
  const simplified = simplifyMultipleObject(group);

  if (isRawObject(simplified)) {
    if (simplified._typeName === 'ActionCall') {
      return (
        <WandActionGroupWandActionBorder>
          <NextActionArrow />
          <WandAction
            spellType={getSpellById(simplified.spell.id).type}
            spellSprite={getSpellById(simplified.spell.id).sprite}
          />
          <RecursionAnnotation {...simplified} />
          <ActionSourceAnnotation {...simplified} />
          <DontDrawAnnotation
            {...simplified}
            dont_draw_actions={simplified.dont_draw_actions}
          />
          <DrawAnnotation />
          <DeckIndexAnnotation deckIndex={simplified.deckIndex} />
          <FriendlyFireAnnotation />
          <WrapAnnotation
            wrappingInto={simplified.wrappingInto}
            wasLastToBeDrawnBeforeWrapNr={
              simplified.wasLastToBeDrawnBeforeWrapNr
            }
            wasLastToBeCalledBeforeWrapNr={
              simplified.wasLastToBeCalledBeforeWrapNr
            }
          />
        </WandActionGroupWandActionBorder>
      );
    } else {
      return (
        <WandActionGroupWandActionBorder
          data-grouping="none"
          data-type=""
          data-name="WandActionGroup"
        >
          <NextActionArrow />
          <WandAction
            spellType={
              (simplified.spell && getSpellById(simplified.spell.id).type) ??
              'projectile'
            }
            spellSprite={
              (simplified.spell && getSpellById(simplified.spell.id).sprite) ??
              'missing-sprite'
            }
          />

          <ActionProxyAnnotation proxy={simplified.proxy} />
          <DeckIndexAnnotation deckIndex={simplified.deckIndex} />
          <FriendlyFireAnnotation />
        </WandActionGroupWandActionBorder>
      );
    }
    // } else if (isArrayObject(simplified)) {
    //   return (
    //     <GroupDiv data-grouping="array">
    //       {simplified.map((g, i) => (
    //         <WandActionGroup group={g} key={i} size={size} />
    //       ))}
    //     </GroupDiv>
    //   );
    // } else if (isMultipleObject(simplified)) {
    //   return (
    //     <MainDiv data-grouping="multiple">
    //       <GroupDiv>
    //         <WandActionGroup group={simplified.first} size={size} />
    //       </GroupDiv>
    //       <CountParentDiv>
    //         <SpacerDiv size={size} />
    //         <CountDiv size={size}>x {simplified.count}</CountDiv>
    //         <SpacerDiv size={size} />
    //       </CountParentDiv>
    //     </MainDiv>
    //   );
  } else {
    return null;
  }
};

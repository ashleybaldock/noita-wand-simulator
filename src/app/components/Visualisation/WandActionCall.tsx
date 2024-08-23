import styled from 'styled-components';
import { NextActionArrow } from '../Visualisation/Arrows';
import {
  ActionSourceAnnotation,
  DeckIndexAnnotation,
  DontDrawAnnotation,
  DrawAnnotation,
  FriendlyFireAnnotation,
  RecursionAnnotation,
} from '../Annotations/';
import { WrapAnnotation } from '../Annotations/WrapAnnotation';
import { WandAction, StyledWandActionBorder } from '../Spells/WandAction';
import type { ActionCall } from '../../calc/eval/ActionCall';
import { getSpellById } from '../../calc/spells';

/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const WandActionCallBorder = styled(StyledWandActionBorder)`
  padding: 3px;
  border: 3px dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: rgba(108, 76, 34, 0.1);
  margin: 4px 0 4px var(--col-spacing, 48px);
  position: relative;
`;

export const WandActionCall = ({ actionCall }: { actionCall: ActionCall }) => {
  return (
    <WandActionCallBorder
      data-grouping="none"
      data-type=""
      data-name="WandActionCall"
    >
      <NextActionArrow />
      <WandAction
        spellType={getSpellById(actionCall.spell.id).type}
        spellId={actionCall.spell.id}
      />
      <RecursionAnnotation {...actionCall} />
      <ActionSourceAnnotation {...actionCall} />
      <DontDrawAnnotation
        {...actionCall}
        dont_draw_actions={actionCall.dont_draw_actions}
      />
      <DrawAnnotation />
      <DeckIndexAnnotation deckIndex={actionCall.deckIndex} />
      <FriendlyFireAnnotation />
      <WrapAnnotation
        wrappingInto={actionCall.wrappingInto}
        wasLastToBeDrawnBeforeWrapNr={actionCall.wasLastToBeDrawnBeforeWrapNr}
        wasLastToBeCalledBeforeWrapNr={actionCall.wasLastToBeCalledBeforeWrapNr}
      />
    </WandActionCallBorder>
  );
};

import styled from 'styled-components';
import { NextActionArrow } from '../Visualisation/Arrows';
import {
  ActionSourceAnnotation,
  DeckIndexAnnotation,
  DontDrawAnnotation,
  DrawAnnotations,
  FriendlyFireAnnotation,
  IterationAnnotation,
  RecursionAnnotation,
} from '../Annotations/';
import { WrapAnnotation } from '../Annotations/WrapAnnotation';
import { WandAction } from '../Spells/WandAction';
import type { ActionCall } from '../../calc/eval/ActionCall';
import { getSpellByActionId } from '../../calc/spells';
import { SpellSlot } from '../Spells/SpellSlot/SpellSlot';

/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const WandActionCallSpellSlot = styled(SpellSlot)`
  padding: var(--spell-pad);
  border: var(--spell-bdw) dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: rgba(108, 76, 34, 0.1);
  margin: 4px 0 4px var(--col-spacing, 48px);
  position: relative;
`;

export const WandActionCall = ({ actionCall }: { actionCall: ActionCall }) => {
  const spell = getSpellByActionId(actionCall.spell.id);
  return (
    <WandActionCallSpellSlot
      data-grouping="none"
      data-type=""
      data-name="WandActionCall"
    >
      <NextActionArrow />
      <WandAction spellType={spell.type} spellId={actionCall.spell.id} />
      <IterationAnnotation spell={spell} iteration={actionCall.iteration} />
      <RecursionAnnotation
        recursive={spell.recursive}
        recursion={actionCall.recursion}
      />
      <ActionSourceAnnotation {...actionCall} />
      <DontDrawAnnotation
        {...actionCall}
        dont_draw_actions={actionCall.dont_draw_actions}
      />
      <DrawAnnotations draws={1} eats={1} />
      <DeckIndexAnnotation
        wandIndex={actionCall?.spell.always_cast_index}
        deckIndex={actionCall.deckIndex}
      />
      <FriendlyFireAnnotation />
      <WrapAnnotation
        wrappingInto={actionCall.wrappingInto}
        wasLastToBeDrawnBeforeWrapNr={actionCall.wasLastToBeDrawnBeforeWrapNr}
        wasLastToBeCalledBeforeWrapNr={actionCall.wasLastToBeCalledBeforeWrapNr}
      />
    </WandActionCallSpellSlot>
  );
};

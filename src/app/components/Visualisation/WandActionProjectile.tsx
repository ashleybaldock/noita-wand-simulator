import styled from 'styled-components';
import { NextActionArrow } from '../Visualisation/Arrows';
import {
  ActionProxyAnnotation,
  DeckIndexAnnotation,
  FriendlyFireAnnotation,
} from '../Annotations/';
import { WandAction, StyledWandActionBorder } from '../Spells/WandAction';
import { getSpellByActionId } from '../../calc/spells';
import type { WandShotProjectile } from '../../calc/eval/WandShotProjectile';

/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const WandActionProjectileBorder = styled(StyledWandActionBorder)`
  padding: 3px;
  border: 3px dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: rgba(108, 76, 34, 0.1);
  margin: 4px 0 4px var(--col-spacing, 48px);
  position: relative;
`;

export const WandActionProjectile = ({
  projectile,
}: {
  projectile: WandShotProjectile;
}) => {
  return (
    <WandActionProjectileBorder
      data-grouping="none"
      data-type=""
      data-name="WandActionProjectile"
    >
      <NextActionArrow />
      <WandAction
        spellType={
          (projectile.spell && getSpellByActionId(projectile.spell.id).type) ??
          'projectile'
        }
        spellId={projectile.spell?.id}
      />

      <ActionProxyAnnotation proxy={projectile.proxy} />
      <DeckIndexAnnotation deckIndex={projectile.spell?.deck_index} />
      <FriendlyFireAnnotation />
    </WandActionProjectileBorder>
  );
};

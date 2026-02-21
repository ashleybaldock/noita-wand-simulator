import styled from 'styled-components';
import { NextActionArrow } from '../Visualisation/Arrows';
import {
  ActionProxyAnnotation,
  DeckIndexAnnotation,
  FriendlyFireAnnotation,
} from '../Annotations/';
import { WandAction } from '../Spells/WandAction';
import { getSpellByActionId } from '../../calc/spells';
import type { WandCastProjectile } from '../../calc/eval/WandCastProjectile';
import { SpellSlot } from '../Spells/SpellSlot/SpellSlot';

/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const WandActionProjectileSpellSlot = styled(SpellSlot)`
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
  projectile: WandCastProjectile;
}) => {
  return (
    <WandActionProjectileSpellSlot
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
        spellId={projectile.spell?.id ?? null}
      />

      <ActionProxyAnnotation proxy={projectile.proxy} />
      <DeckIndexAnnotation deckIndex={projectile.spell?.deck_index} />
      <FriendlyFireAnnotation />
    </WandActionProjectileSpellSlot>
  );
};

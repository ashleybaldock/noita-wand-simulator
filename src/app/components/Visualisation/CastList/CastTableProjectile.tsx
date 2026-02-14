import type { WandCastProjectile } from '../../../calc/eval/WandCastProjectile';
import { getSpellByActionId } from '../../../calc/spells';
import {
  ActionProxyAnnotation,
  DeckIndexAnnotation,
  FriendlyFireAnnotation,
} from '../../Annotations';
import { WandAction } from '../../Spells/WandAction';
import styled from 'styled-components';
import { WithDebugHints } from '../../Debug';
import { ProjectileCountAnnotation } from '../../Annotations/ProjectileCountAnnotation';
import { SpellSlot } from '../../Spells/SpellSlot/SpellSlot';

const ArrayGroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-self: end;
`;
const MultiGroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-self: end;
`;

export const MainDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: min-content;
  width: auto;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
  grid-row: heading;
  margin: 0;
  align-items: center;
  text-align: center;

  ${WithDebugHints} && {
    border: 1px dashed blue;
    ${MultiGroupDiv} && {
      border-top: 1px dashed orange;
      border-right: 1px dashed orange;
    }
    ${ArrayGroupDiv} && {
      border-bottom: 1px dashed red;
      border-left: 1px dashed red;
    }
  }
`;
/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const CastTableSpellSlot = styled(SpellSlot)`
  position: relative;
  padding: 3px;
  border: 3px dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: black;
  margin: 0;
`;

export const CastTableProjectile = ({
  projectile,
  count,
}: {
  projectile: WandCastProjectile;
  count: number;
}) => {
  return (
    <MainDiv data-name="CastTableProjectile">
      <CastTableSpellSlot
        data-grouping="none"
        data-type=""
        data-name="ProjActionGroup"
      >
        <WandAction
          spellType={
            (projectile.spell &&
              getSpellByActionId(projectile.spell.id).type) ??
            'projectile'
          }
          spellId={projectile.spell?.id}
        />
        <ProjectileCountAnnotation count={count}></ProjectileCountAnnotation>

        <ActionProxyAnnotation
          spell={projectile.spell}
          proxy={projectile.proxy}
        />
        <DeckIndexAnnotation
          deckIndex={projectile.spell?.deck_index}
          wandIndex={projectile.spell?.always_cast_index}
        />
        <FriendlyFireAnnotation />
      </CastTableSpellSlot>
    </MainDiv>
  );
};

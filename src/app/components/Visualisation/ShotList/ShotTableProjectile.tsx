import styled from 'styled-components';
import type { WandShotProjectile } from '../../../calc/eval/WandShotProjectile';
import { getSpellByActionId } from '../../../calc/spells';
import {
  ActionProxyAnnotation,
  DeckIndexAnnotation,
  FriendlyFireAnnotation,
} from '../../Annotations';
import { WithDebugHints } from '../../Debug';
import { StyledWandActionBorder, WandAction } from '../../Spells/WandAction';

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

const MainDiv = styled.div`
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
const ShotTableProjectileBorder = styled(StyledWandActionBorder)`
  position: relative;
  padding: 3px;
  border: 3px dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: black;
  margin: 0;
`;

export const ShotTableProjectile = ({
  projectile,
}: {
  projectile: WandShotProjectile;
}) => {
  return (
    <MainDiv>
      <ShotTableProjectileBorder
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

        <ActionProxyAnnotation
          spell={projectile.spell}
          proxy={projectile.proxy}
        />
        <DeckIndexAnnotation
          deckIndex={projectile.spell?.deck_index}
          wandIndex={projectile.spell?.always_cast_index}
        />
        <FriendlyFireAnnotation />
      </ShotTableProjectileBorder>
    </MainDiv>
  );
};

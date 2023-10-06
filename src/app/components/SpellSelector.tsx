import styled from 'styled-components/macro';
import { Spell } from '../calc/spell';
import { spells } from '../calc/spells';
import {
  mapSpellTypeToGroup,
  spellTypeGroupInfoMap,
  spellTypeInfoMap,
} from '../calc/spellTypes';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import { useMemo } from 'react';
import { WandAction } from './wandAction/WandAction';
import WandActionBorder from './wandAction/WandActionBorder';
import { useAppSelector } from '../redux/hooks';
import { ConfigState, selectConfig } from '../redux/configSlice';
import { groupBy, objectEntries } from '../util/util';
import { Tabs } from './generic';
import {
  ExportButton,
  LoadButton,
  ResetButton,
  UndoButton,
  RedoButton,
} from './buttons';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1;
  background-color: #100e0e;
`;

const SpellCategorySpellsDiv = styled.div`
  --sizes-spell-base: 40px;
  --gap-multiplier: 0.12;
  display: grid;
  flex-wrap: wrap;
  flex: 1;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--sizes-spell-base), 1fr)
  );
  gap: calc(var(--sizes-spell-base) * var(--gap-multiplier));
  min-height: calc(6 * var(--sizes-spell-base) * (1 + var(--gap-multiplier)));
  padding: 7px 6px;
  align-content: start;
`;

const SpellSelectorWandActionBorder = styled(WandActionBorder)`
  position: relative;
  background-image: url(/data/inventory/grid_box_unknown.png);
  padding-left: 0px;
  padding-top: 0px;

  &::before {
    content: '';
    height: 100%;
    background-image: url(/data/inventory/grid_box.png);
    position: absolute;
    width: 100%;
    background-size: cover;
    image-rendering: pixelated;
    opacity: 0.4;
    transition: opacity var(--transition-hover-out);
  }

  &:hover::before {
    opacity: 0.6;
    transition: opacity var(--transition-hover-in);
  }
`;
const SpellSelectorWandActionDragSource = styled(WandActionDragSource)`
  padding: 0.04em 0 0 0.04em;
`;

const SpellSelectorWandAction = styled(WandAction)`
  opacity: 0.84;
  padding: 0.04em;
  transform-origin: 0.8em 0.8em;
  transition: opacity var(--transition-hover-in),
    transform var(--transition-hover-in);

  &:hover {
    opacity: 0.9;
    transition: opacity var(--transition-hover-out),
      transform var(--transition-hover-out);
  }
`;

const SpellShortcuts = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
  width: 100%;
`;

const EditButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
`;

const SpellHotbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  background-color: black;
`;

const isSpellUnlocked = (
  unlocks: ConfigState['config']['unlocks'],
  spell: Spell,
) => {
  return !spell.spawn_requires_flag || unlocks[spell.spawn_requires_flag];
};

const isBetaEnabled = (
  configBetaEnabled: ConfigState['config']['showBeta'],
  spell: Spell,
) => {
  return !spell.beta || configBetaEnabled;
};

type WandActionSelectProps = {
  spell: Spell;
};

const WandActionSelect = (props: WandActionSelectProps) => (
  <SpellSelectorWandActionBorder>
    <SpellSelectorWandActionDragSource
      actionId={props.spell.id}
      key={props.spell.id}
    >
      <SpellSelectorWandAction spell={props.spell} />
    </SpellSelectorWandActionDragSource>
  </SpellSelectorWandActionBorder>
);

export function SpellSelector() {
  const { config } = useAppSelector(selectConfig);

  const unlockedActions = useMemo(
    () =>
      spells.filter(
        (a) =>
          isSpellUnlocked(config.unlocks, a) &&
          isBetaEnabled(config.showBeta, a),
      ),
    [config.unlocks, config.showBeta],
  );

  const spellsByGroupedType = useMemo(() => {
    return groupBy(unlockedActions, ({ type }) => mapSpellTypeToGroup[type]);
  }, [unlockedActions]);

  const spellsByType = useMemo(() => {
    return groupBy(unlockedActions, ({ type }) => type);
  }, [unlockedActions]);

  const spellsByTypeGrouped = useMemo(() => {
    const entries = objectEntries(spellsByType);
    return groupBy(
      entries,
      ([actionType, spells]) => mapSpellTypeToGroup[actionType],
    );
  }, [spellsByType]);

  const tabPerGroupedType = useMemo(() => {
    return (
      objectEntries(spellsByTypeGrouped)
        // .reverse()
        .map(([actionTypeGroup, spellTypes]) => {
          const { name, src } = spellTypeGroupInfoMap[actionTypeGroup];
          return {
            title: name,
            iconSrc: src,
            content: (
              <>
                {spellTypes.map(([spellType, spells]) => {
                  // const { name, src } = spellTypeInfoMap[spellType];
                  return (
                    <SpellCategorySpellsDiv>
                      {spells.map((spell) => (
                        <WandActionSelect spell={spell} key={spell.id} />
                      ))}
                    </SpellCategorySpellsDiv>
                  );
                })}
              </>
            ),
          };
        })
    );
  }, [spellsByTypeGrouped]);

  const tabPerType = useMemo(() => {
    return (
      objectEntries(spellsByType)
        // .reverse()
        .map(([actionType, actions]) => {
          const { name, src } = spellTypeInfoMap[actionType];

          return {
            title: name,
            iconSrc: src,
            content: (
              <SpellCategorySpellsDiv>
                {actions.map((spell) => (
                  <WandActionSelect spell={spell} key={spell.id} />
                ))}
              </SpellCategorySpellsDiv>
            ),
          };
        })
    );
  }, [spellsByType]);

  const allInOneTab = useMemo(() => {
    return [
      {
        title: 'All Spells',
        iconSrc: '',
        content: (
          <SpellCategorySpellsDiv>
            {spells.map((spell) => (
              <WandActionSelect spell={spell} key={spell.id} />
            ))}
          </SpellCategorySpellsDiv>
        ),
      },
    ];
  }, []);

  const tabs = useMemo(() => {
    if (config.showSpellsInCategories) {
      // return tabPerType;
      return tabPerGroupedType;
    } else {
      return allInOneTab;
    }
  }, [allInOneTab, config.showSpellsInCategories, tabPerGroupedType]);

  return (
    <MainDiv>
      <Tabs tabs={tabs} />
      <SpellShortcuts>
        <EditButtons>
          <UndoButton />
          <RedoButton />
          <ResetButton />
          <LoadButton />
          <ExportButton />
        </EditButtons>
        <SpellHotbar></SpellHotbar>
      </SpellShortcuts>
    </MainDiv>
  );
}

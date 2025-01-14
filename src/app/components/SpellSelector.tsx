import styled from 'styled-components/macro';
import { Spell } from '../calc/spell';
import { spells } from '../calc/spells';
import {
  getBackgroundUrlForSpellType,
  spellTypeGroupInfoMap,
  spellTypeGroupsOrdered,
  spellTypeInfoMap,
} from '../calc/spellTypes';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import { useMemo } from 'react';
import { WandAction } from './wandAction/WandAction';
import { WandActionBorder } from './wandAction/WandActionBorder';
import { useAppSelector } from '../redux/hooks';
import { ConfigState, selectConfig } from '../redux/configSlice';
import { groupBy, objectEntries } from '../util/util';
import { Tabs } from './generic';

const MainDiv = styled.div`
  --sizes-spell-base: 40px;

  display: flex;
  flex-direction: column;
  flex: 1 1;
  background-color: #100e0e;
  --gap-multiplier: 0.12;
  min-height: calc(6 * var(--sizes-spell-base) * (1 + var(--gap-multiplier)));
`;

const SpellCategorySpellsDiv = styled.div`
  padding: 0.26em 0.16em;
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--sizes-spell-base), 1fr)
  );
  gap: calc(var(--sizes-spell-base) * var(--gap-multiplier));
  align-content: start;
`;

const SpellSelectorWandActionBorder = styled(WandActionBorder)`
  position: relative;
  background-image: url('/data/inventory/grid_box_unknown.png');
  padding-left: 0px;
  padding-top: 0px;

  &::before {
    content: '';
    height: 100%;
    background-image: url('/data/inventory/grid_box.png');
    position: absolute;
    width: 100%;
    background-size: cover;
    image-rendering: pixelated;
    opacity: 1em;
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
  --transition-props: opacity, transform;

  opacity: 0.84;
  padding: 0.04em;
  transform-origin: 0.8em 0.8em;

  &:hover {
    opacity: 0.9;
  }
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

const WandActionSelect = ({
  spell: { id, type, sprite },
}: WandActionSelectProps) => (
  <SpellSelectorWandActionBorder>
    <SpellSelectorWandActionDragSource actionId={id} key={id}>
      <SpellSelectorWandAction spellType={type} spellSprite={sprite} />
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

  const spellsByType = useMemo(() => {
    return groupBy(unlockedActions, ({ type }) => type);
  }, [unlockedActions]);

  const tabPerGroupedType = useMemo(
    () =>
      spellTypeGroupsOrdered.map((spellTypeGroup) => {
        const { contains } = spellTypeGroupInfoMap[spellTypeGroup];
        return {
          titleParts: contains.map((spellType) => {
            const { name, src, egSrc } = spellTypeInfoMap[spellType];
            return {
              text: name,
              type: spellType,
              bgSrc: src,
              egSrc: egSrc,
              key: `part-${name}`,
            };
          }),
          key: `tab-${spellTypeGroup}`,
          iconSrc: '',
          content: (
            <>
              {contains.map((spellType) => {
                return (
                  <SpellCategorySpellsDiv key={spellType}>
                    {spellsByType[spellType].map((spell) => (
                      <WandActionSelect spell={spell} key={spell.id} />
                    ))}
                  </SpellCategorySpellsDiv>
                );
              })}
            </>
          ),
        };
      }),
    [spellsByType],
  );

  const tabPerType = useMemo(() => {
    return (
      objectEntries(spellsByType)
        // .reverse()
        .map(([spellType, actions]) => {
          const { name, src } = spellTypeInfoMap[spellType];

          return {
            titleParts: [
              {
                text: name,
                type: spellType,
                style: {
                  backgroundImage: getBackgroundUrlForSpellType(spellType),
                },
              },
            ],
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
        titleParts: [
          {
            text: 'All Spells',
            imgSrc: '',
            spellSprite: '',
          },
        ],
        iconSrc: '',
        content: (
          <>
            {objectEntries(spellsByType).map(([spellType, spells]) => {
              return (
                <SpellCategorySpellsDiv key={spellType}>
                  {spellsByType[spellType].map((spell) => (
                    <WandActionSelect spell={spell} key={spell.id} />
                  ))}
                </SpellCategorySpellsDiv>
              );
            })}
          </>
        ),
      },
    ];
  }, [spellsByType]);

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
    </MainDiv>
  );
}

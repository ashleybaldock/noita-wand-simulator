import styled from 'styled-components';
import { useMemo } from 'react';
import { groupBy, objectEntries } from '../../util/util';
import type { Spell } from '../../calc/spell';
import { spells } from '../../calc/spells';
import { useAppDispatch, useConfig } from '../../redux/hooks';
import type { Config, ConfigState } from '../../redux/configSlice';
import {
  getBackgroundUrlForSpellType,
  spellTypeGroupInfoMap,
  spellTypeGroupsOrdered,
  spellTypeInfoMap,
} from '../../calc/spellTypes';
import { Tabs } from '../generic';
import {
  DraggableWandAction,
  StyledWandActionBorder,
  WandActionDragSource,
} from '../Spells/WandAction';
import {
  insertSpellAfterCursor,
  insertSpellBeforeCursor,
} from '../../redux/editorThunks';

const MainDiv = styled.div`
  --bsize-spell: 40px;

  display: flex;
  flex-direction: column;
  flex: 1 1;
  background-color: #100e0e;
  --gap-multiplier: 0.12;
  min-height: calc(6 * var(--bsize-spell) * (1 + var(--gap-multiplier)));
`;

const SpellCategorySpellsDiv = styled.div`
  padding: 0.26em 0.16em;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--bsize-spell), 1fr));
  gap: calc(var(--bsize-spell) * var(--gap-multiplier));
  align-content: start;
`;

const SpellSelectorWandActionBorder = styled(StyledWandActionBorder)`
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
    opacity: 1;
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

const SpellSelectorWandAction = styled(DraggableWandAction)`
  --transition-props: opacity, transform;

  opacity: 0.84;
  padding: 0.04em;
  transform-origin: 0.8em 0.8em;

  &:hover {
    opacity: 0.9;
  }
`;

const isSpellUnlocked = (config: Config, spell: Spell) => {
  return !spell.spawn_requires_flag || config[spell.spawn_requires_flag];
};

const isBetaEnabled = (
  configBetaEnabled: ConfigState['config']['showBeta'],
  spell: Spell,
) => {
  return !spell.beta || configBetaEnabled;
};

const WandActionSelect = ({
  spell: { id, type, sprite },
}: {
  spell: Spell;
}) => {
  const dispatch = useAppDispatch();

  const dragSourceOnClick = (clickEvent: React.MouseEvent<HTMLDivElement>) => {
    clickEvent.preventDefault();

    if (clickEvent.shiftKey) {
      dispatch(insertSpellAfterCursor({ spellId: id }));
    } else {
      dispatch(insertSpellBeforeCursor({ spellId: id }));
    }
  };
  return (
    <SpellSelectorWandActionBorder>
      <SpellSelectorWandActionDragSource
        actionId={id}
        key={id}
        onClick={dragSourceOnClick}
      >
        <SpellSelectorWandAction
          spellId={id}
          spellType={type}
          spellSprite={sprite}
        />
      </SpellSelectorWandActionDragSource>
    </SpellSelectorWandActionBorder>
  );
};

export const SpellSelector = () => {
  const config = useConfig();

  const unlockedActions = useMemo(
    () =>
      spells.filter(
        (a) => isSpellUnlocked(config, a) && isBetaEnabled(config.showBeta, a),
      ),
    [config],
  );

  const spellsByType = useMemo(() => {
    return groupBy(unlockedActions, ({ type }) => type);
  }, [unlockedActions]);

  const tabPerGroupedType = useMemo(
    () =>
      spellTypeGroupsOrdered
        .map((spellTypeGroup) => {
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
        })
        .reverse(),
    [spellsByType],
  );

  const tabPerType = useMemo(() => {
    return objectEntries(spellsByType)
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
      .reverse();
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
            {objectEntries(spellsByType).map(([spellType]) => {
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
};

import styled from 'styled-components';
import { useMemo } from 'react';
import { groupBy, objectEntries } from '../../util/util';
import type { Spell } from '../../calc/spell';
import { spells } from '../../calc/spells';
import { useAppDispatch, useConfig } from '../../redux/hooks';
import type { Config } from '../../redux/configSlice';
import {
  getSpriteForSpellType,
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

  position: sticky;
  top: -100px;

  &::before {
    content: '';
    width: auto;
    height: 6px;
    background-color: transparent;
    display: flex;
    position: sticky;
    top: 30px;
    z-index: 10;
    box-shadow:
      inset 0 3px 3px 0px #000,
      0 -4px 0 0 var(--color-base-background);
    border: 0.16rem solid var(--color-tab-border-active);
    border-radius: 0.26rem 0.46rem 0 0;
    border-bottom: 0 hidden transparent;
  }
`;

const SpellCategorySpellsDiv = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(var(--bsize-spell), 1fr));
  align-content: start;
  justify-content: stretch;
  display: grid;
  transform: scaleY(-1);
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 6px 8px;
  gap: 2px;

  padding: var(--bsize-padh);
  gap: var(--bsize-gap);
  overscroll-behavior: none;
  box-sizing: content-box;
  height: fit-content;
  background: none;
  box-shadow: none;

  & > div {
    transform: scaleY(-1);
  }
`;

const SpellSelectorWandActionBorder = styled(StyledWandActionBorder)`
  position: relative;
  background-image: var(--sprite-inventory-grid-box-unknown);
  padding-left: 0;
  padding-top: 0;

  --size-spell: var(--bsize-spell, 1em);
  --size-spell-border-width: var(
    --bsize-spell-border-width,
    calc(var(--size-spell) + (2 * var(--xsize-spell-border)))
  );
  width: var(--size-spell);
  height: var(--size-spell);
  background-size: contain;
  image-rendering: pixelated;
  background-clip: padding-box;

  box-shadow: 0 0 2px #000;

  &:hover {
    background-image: var(--sprite-inventory-grid-box);
  }
`;
const SpellSelectorWandActionDragSource = styled(WandActionDragSource)`
  padding: 0.04em 0 0 0.04em;
`;

const SpellSelectorWandAction = styled(DraggableWandAction)`
  opacity: 1;
  padding: 0.04em;

  &:hover {
  }
`;

const isSpellUnlocked = (config: Config, spell: Spell) => {
  return !spell.spawn_requires_flag || config[spell.spawn_requires_flag];
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
    <SpellSelectorWandActionBorder data-name="SpellSelectorWandActionBorder ">
      <SpellSelectorWandActionDragSource
        actionId={id}
        key={id}
        onClick={dragSourceOnClick}
      >
        <SpellSelectorWandAction spellId={id} spellType={type} />
      </SpellSelectorWandActionDragSource>
    </SpellSelectorWandActionBorder>
  );
};

export const SpellSelector = () => {
  const config = useConfig();

  const unlockedActions = useMemo(
    () => spells.filter((a) => isSpellUnlocked(config, a)),
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
              const { name, sprite, exampleId } = spellTypeInfoMap[spellType];
              return {
                text: name,
                type: spellType,
                bgSrc: sprite,
                egSrc: exampleId,
                key: `part-${name}`,
              };
            }),
            key: `tab-${spellTypeGroup}`,
            iconSrc: '',
            content: (
              <>
                {contains.map((spellType) => {
                  return (
                    <SpellCategorySpellsDiv
                      key={spellType}
                      data-name="SpellCategorySpellsDiv"
                    >
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
        const { name, sprite } = spellTypeInfoMap[spellType];

        return {
          titleParts: [
            {
              text: name,
              type: spellType,
              style: {
                backgroundImage: getSpriteForSpellType(spellType),
              },
            },
          ],
          iconSrc: sprite,
          content: (
            <SpellCategorySpellsDiv data-name="SpellCategorySpellsDiv">
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
                <SpellCategorySpellsDiv
                  key={spellType}
                  data-name="SpellCategorySpellsDiv"
                >
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
    <MainDiv data-name="SpellSelector">
      <Tabs tabs={tabs} />
    </MainDiv>
  );
};

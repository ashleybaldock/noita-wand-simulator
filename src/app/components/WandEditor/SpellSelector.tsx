import styled from 'styled-components';
import { useMemo } from 'react';
import { groupBy, objectEntries } from '../../util/util';
import type { Spell } from '../../calc/spell';
import { spells } from '../../calc/spells';
import { useAppDispatch, useConfig } from '../../redux/hooks';
import type { Config } from '../../redux/configSlice';
import { getSpriteForSpellType, spellTypeInfoMap } from '../../calc/spellTypes';
import { Tabs } from '../generic';
import {
  DraggableWandAction,
  LockedWandAction,
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
  --top-offset: -8px;

  &::before {
    content: '';
    width: auto;
    height: 6px;
    background-color: transparent;
    display: flex;
    position: sticky;
    z-index: 10;
    box-shadow:
      inset 0 3px 3px 0px #000,
      0 -4px 0 0 var(--color-base-background);
    border: var(--ou) solid var(--color-tab-border-active);
    border-width: calc(var(--ou) * 1) calc(var(--ou) * 0.7) 0;
    border-radius: 0.26rem 0.46rem 0 0;
    border-bottom: 0 hidden transparent;

    font-size: 14px;
    padding: calc(var(--ou) * 1);
    inset: var(--top-banner-height) auto auto auto;
    margin: calc(var(--top-offset) * 0) calc(var(--ou) * 1)
      calc(var(--top-offset) * 1);
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

  position: sticky;
  scroll-snap-stop: normal;
  scroll-snap-align: start end;

  & > div {
    transform: scaleY(-1);
  }
`;

const SpellSelectorWandActionBorder = styled(StyledWandActionBorder)`
  --spellbg: var(--sprite-inventory-grid-box-unknown);

  &:hover {
    background-image: var(--spellbg);
  }

  position: relative;
  padding-left: 0;
  padding-top: 0;

  --size-spell: var(--bsize-spell, 1em);
  --size-spell-border-width: var(
    --bsize-spell-border-width,
    calc(var(--size-spell) + (2 * var(--xsize-spell-border)))
  );
  width: var(--size-spell);
  height: var(--size-spell);
  background-image: var(--spellbg);
  background-size: contain;
  background-clip: padding-box;
  image-rendering: pixelated;

  box-shadow: 0 0 2px #000;

  scroll-margin: 10px;
  scroll-snap-stop: normal;
  scroll-snap-align: center;
`;
const SpellSelectorWandActionDragSource = styled(WandActionDragSource)`
  padding: 0.04em 0 0 0.04em;
`;

const SpellSelectorLockedSpell = styled(LockedWandAction)`
  background-size: 100%, 100%, 50%;
  background-image:
    linear-gradient(145deg, #000a 20%, #0002 30% 50%, #000a 70%),
    var(--data-spelltype-sprite), var(--sprite-unidentified-spell);
  background-blend-mode: hue, saturation;
  opacity: 0.5;
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
  spell: { id, type },
  locked = false,
}: {
  spell: Spell;
  locked?: boolean;
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
  return locked ? (
    <SpellSelectorWandActionBorder data-name="SpellSelectorWandActionBorder">
      <SpellSelectorLockedSpell spellType={type}></SpellSelectorLockedSpell>
    </SpellSelectorWandActionBorder>
  ) : (
    <SpellSelectorWandActionBorder data-name="SpellSelectorWandActionBorder">
      <SpellSelectorWandActionDragSource
        actionId={id}
        onClick={dragSourceOnClick}
      >
        <SpellSelectorWandAction spellId={id} spellType={type} />
      </SpellSelectorWandActionDragSource>
    </SpellSelectorWandActionBorder>
  );
};

export const SpellSelector = () => {
  const config = useConfig();

  const spellsWithUnlockInfo = useMemo(
    () =>
      spells.map((spell) => ({
        locked: !isSpellUnlocked(config, spell),
        spell,
      })),
    [config],
  );

  const spellsWithUnlockInfoByType = useMemo(() => {
    return groupBy(spellsWithUnlockInfo, ({ spell: { type } }) => type);
  }, [spellsWithUnlockInfo]);

  // const tabPerGroupedType = useMemo(
  //   () =>
  //     spellTypeGroupsOrdered
  //       .map((spellTypeGroup) => {
  //         const { contains } = spellTypeGroupInfoMap[spellTypeGroup];
  //         return {
  //           titleParts: contains.map((spellType) => {
  //             const { name, sprite, exampleId } = spellTypeInfoMap[spellType];
  //             return {
  //               text: name,
  //               type: spellType,
  //               bgSrc: sprite,
  //               egSrc: exampleId,
  //               key: `part-${name}`,
  //             };
  //           }),
  //           key: `tab-${spellTypeGroup}`,
  //           iconSrc: '',
  //           content: (
  //             <>
  //               {contains.map((spellType) => {
  //                 return (
  //                   <SpellCategorySpellsDiv
  //                     key={spellType}
  //                     data-name="SpellCategorySpellsDiv"
  //                   >
  //                     {spellsWithUnlockInfoByType[spellType].map(
  //                       ({ locked, spell }) => (
  //                         <WandActionSelect
  //                           locked={locked}
  //                           spell={spell}
  //                           key={spell.id}
  //                         />
  //                       ),
  //                     )}
  //                   </SpellCategorySpellsDiv>
  //                 );
  //               })}
  //             </>
  //           ),
  //         };
  //       })
  //       .reverse(),
  //   [spellsWithUnlockInfoByType],
  // );

  const tabPerType = useMemo(() => {
    return objectEntries(spellsWithUnlockInfoByType)
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
              {actions.map(({ spell, locked }) => (
                <WandActionSelect
                  spell={spell}
                  locked={locked}
                  key={spell.id}
                />
              ))}
            </SpellCategorySpellsDiv>
          ),
        };
      })
      .reverse();
  }, [spellsWithUnlockInfoByType]);

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
            {objectEntries(spellsWithUnlockInfoByType).map(([spellType]) => {
              return (
                <SpellCategorySpellsDiv
                  key={spellType}
                  data-name="SpellCategorySpellsDiv"
                >
                  {spellsWithUnlockInfoByType[spellType].map(
                    ({ spell, locked }) => (
                      <WandActionSelect
                        spell={spell}
                        locked={locked}
                        key={spell.id}
                      />
                    ),
                  )}
                </SpellCategorySpellsDiv>
              );
            })}
          </>
        ),
      },
    ];
  }, [spellsWithUnlockInfoByType]);

  const tabs = useMemo(() => {
    if (config.showSpellsInCategories) {
      return tabPerType;
    } else {
      return allInOneTab;
    }
  }, [allInOneTab, config.showSpellsInCategories, tabPerType]);

  return (
    <MainDiv data-name="SpellSelector">
      <Tabs tabs={tabs} />
    </MainDiv>
  );
};

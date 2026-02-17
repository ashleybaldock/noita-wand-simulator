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
  WandAction,
  WandActionDragSource,
} from '../Spells/WandAction';
import {
  insertSpellAfterCursor,
  insertSpellBeforeCursor,
} from '../../redux/editorThunks';
import { SpellSlot } from '../Spells/SpellSlot';

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

  --bsize-spell: max(
    1px,
    round(down, clamp(32px, calc(100cqmax / 16), 32px), 1px)
  );
  grid-template-columns: repeat(
    auto-fit,
    minmax(max(1px, round(down, var(--bsize-spell), 1px)), 1fr)
  );
`;

const TabsWandActionFamily = styled.div`
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  grid-auto-rows: 1fr;
  --maxcols: round(down, 100cqw / var(--bsize-spell), var(--bsize-spell));
  grid-row: auto/span 1;
  grid-column: auto/span round(down, sqrt(var(--n)), 2);
  grid-row: auto/span round(up, sqrt(var(--n)), 2);
`;

const TabsWandAction = styled(WandAction)`
  --transition-props: opacity;
  --sizes-spell: 2em;
  --v: 0.3em;

  transform: none;
  opacity: 1;
  cursor: inherit;

  transform: rotate(0deg) scale(1) translate(1px);
  height: 100%;
  width: auto;
  min-width: calc(var(--v) * 0.25);
  min-height: calc(var(--v) * 0.25);
  aspect-ratio: 1;
  image-rendering: pixelated;
  background-size: 67%, 100%;
  background-clip: padding-box, border-box, border-box;
  background-repeat: no-repeat, space, space;
  background-origin: content-box, border-box, border-box;
  background-position:
    center,
    bottom -11% right -11%;
  background-image: var(--data-spelltype-sprite);
  border-image-source: var(--data-spelltype-sprite);
  border-image-slice: 3 3 3 3;
  border-image-outset: 4px;
  border-image-width: 6px;

  border: var(--v) solid #0000;
  border-width: var(--v) 0 0 var(--v);
  padding: 0 var(--v) var(--v) 0;
  margin: 0;

  &:hover {
    transform: none;
    opacity: 1;
  }
`;

const SpellSelectorWandActionBorder = styled(SpellSlot)`
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

  const tabPerType = useMemo(() => {
    return objectEntries(spellsWithUnlockInfoByType)
      .map(([spellType, actions]) => {
        const { sprite } = spellTypeInfoMap[spellType];
        const key = `tab--${spellType}`;
        const title = `Spells of type ${spellType}`;

        return {
          style: {
            backgroundImage: getSpriteForSpellType(spellType),
          },
          iconSrc: sprite,
          title,
          key,
          buttonContent: <TabsWandAction key={key} tooltip={false} />,
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
        title: 'All Spells',
        key: 'tab-all',
        buttonContent: <TabsWandAction key={'tab--all'} tooltip={false} />,
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

  return (
    <MainDiv data-name="SpellSelector">
      <Tabs tabs={config.showSpellsInCategories ? tabPerType : allInOneTab} />
    </MainDiv>
  );
};

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

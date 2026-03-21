import styled from 'styled-components';
import { useAppDispatch } from '../redux/hooks';
import type { ConfigSection } from '../redux/configSlice';
import { disableAllUnlocks, enableAllUnlocks } from '../redux/configSlice';
import { Button } from './generic';
import { getUnlockName, unlockConditions } from '../calc/unlocks';
import { useMemo } from 'react';
import { YesNoConfigToggle } from './Input/YesNoToggle';

const MainDiv = styled.div`
  display: grid;
  grid-template-rows: subgrid;
  height: 100%;
`;

// const ConfigDiv = styled.div`
//   columns: 1;
//   column-fill: auto;
//   column-rule-color: transparent;
//   column-rule-style: solid;
//   column-rule-width: 2em;

//   padding: 0.6em;
//   gap: 2em;
//   @media screen and (min-width: 500px) {
//     columns: min(18em, 30vw) 3;
//     height: 80vh;
//   }
// `;

const ConfigSectionHeading = styled.div`
  font-weight: normal;
  text-transform: uppercase;
  color: var(--color-toggle-label);

  @media screen and (max-width: 500px) {
    & {
      position: sticky;
      top: calc(var(--modal-header-height) * 0.5);
      z-index: 2;
      top: calc(var(--modal-header-height) * 1.7);
      z-index: 22;
      background-color: var(--color-modal-bg);
      padding: 0.2em 0;
    }
  }
`;

// const ToggleWrap = styled.div`
//   &::after {
//     content: ':';
//     padding-right: 1em;
//     margin-right: 0.4em;
//     flex: 1 1 100%;
//     border-bottom: 3px dotted #222;
//     height: 0.9em;
//   }

//   white-space: nowrap;
//   display: flex;
//   flex: 1 1 auto;

//   color: var(--color-toggle-chosen);
//   &:hover {
//     color: var(--color-toggle-hover);
//   }
//   text-decoration: none;
// `;

// const StyledYesNoToggle = styled(YesNoToggle)`
//   color: var(--color-toggle-chosen);

//   display: flex;
//   align-items: last baseline;

//   margin: 0.5em 0 0.3em 0.4em;

//   &:hover {
//     color: var(--color-toggle-hover);
//   }
// `;

export const ConfigToggleGroup = styled(
  ({
    title = '',
    bulkSelectControls = false,
    section,
    children,
    className,
  }: React.PropsWithChildren<{
    title?: string;
    showTitle?: boolean;
    bulkSelectControls?: boolean;
    section?: ConfigSection;
    groupName?: string;
    className?: string;
  }>) => {
    const dispatch = useAppDispatch();
    return (
      <div className={className} data-name={'ConfigToggleGroup'}>
        {title && <ConfigSectionHeading>{title}</ConfigSectionHeading>}
        {bulkSelectControls && section && (
          <>
            <Button onClick={() => dispatch(enableAllUnlocks())}>
              {'Unlock All'}
            </Button>
            <Button onClick={() => dispatch(disableAllUnlocks())}>
              {'Lock All'}
            </Button>
          </>
        )}
        {children}
      </div>
    );
  },
)`
  display: grid;
  grid-template-columns: auto;

  break-inside: avoid-column;
  margin-bottom: 0.5em;

  @media screen and (max-width: 500px) {
    padding-bottom: 1.5em;
    margin-bottom: 0;
  }
  &:first-child {
    margin-top: 1.5em;
  }
  & > div:first-of-type {
    grid-column: 1 / span 2;
  }
`;

export const ConfigEditor = () => {
  const sortedUnlocks = useMemo(() => {
    return [...unlockConditions]
      .map((unlock) => ({
        key: unlock,
        field: unlock,
        name: getUnlockName(unlock),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [unlockConditions]);

  return (
    <MainDiv data-name="ConfigEditor">
      <ConfigToggleGroup title={'Simulation'}>
        <YesNoConfigToggle field={'pauseCalculations'}>
          {'Pause Simulation'}
        </YesNoConfigToggle>
      </ConfigToggleGroup>
      <ConfigToggleGroup title={'Visualisation'}>
        <YesNoConfigToggle field={'castShowChanged'}>
          {'Hide Unaltered State Variables'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showDurationsInFrames'}>
          {'Show Durations in Frames'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'condenseShots'}>
          {'Combine Repeated Actions'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'condenseShots'}>
          {'Group Projectiles'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showActionTree'}>
          {'Show Action Tree'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showDirectActionCalls'}>
          {'Show Direct Action Calls'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showDivides'}>
          {'Show Divide By Spells'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showGreekSpells'}>
          {'Show Greek Spells'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showDeckIndexes'}>
          {'Show Deck Indexes'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showRecursion'}>
          {'Show Recursion'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showRecursion'}>
          {'Show Iteration'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showProxies'}>
          {'Show Projectile Proxies'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showSources'}>
          {'Show Action Sources'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showDontDraw'}>
          {'Show Draw Inhibition'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showChargeUsage'}>
          {'Highlight spells that consume charges'}
        </YesNoConfigToggle>
      </ConfigToggleGroup>
      <ConfigToggleGroup title={'Cast Config'}>
        <YesNoConfigToggle field={'unlimitedSpells'}>
          {'Unlimited Spells'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'infiniteSpells'}>
          {'Ignore spell charge limits'}
        </YesNoConfigToggle>
      </ConfigToggleGroup>
      {/* <ConfigToggleGroup title={'End Simulation'}> */}
      {/*   <YesNoConfigToggle field={'endSimulationOnRefresh'}> */}
      {/*     {'...on Wand Refresh'} */}
      {/*   </YesNoConfigToggle> */}
      {/* </ConfigToggleGroup> */}
      <ConfigToggleGroup title={'Wand Editor'}>
        <YesNoConfigToggle field={'swapOnMove'}>
          {'Swap Spell Position on move'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showLockedSpellPlaceholders'}>
          {'Display placeholder for locked spells'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showSpellsInCategories'}>
          {'Show Spells in Categories'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'showExtra'}>
          {'Show Debug Spells'}
        </YesNoConfigToggle>
      </ConfigToggleGroup>
      <ConfigToggleGroup
        title={'Unlockable Spells'}
        bulkSelectControls={true}
        section={'unlocks'}
      >
        {sortedUnlocks.map(({ key, name, field }) => (
          <YesNoConfigToggle key={key} field={field}>
            {name}
          </YesNoConfigToggle>
        ))}
      </ConfigToggleGroup>
      <ConfigToggleGroup title={'Accessibility'}>
        <YesNoConfigToggle field={'hideAccessibilityHints'}>
          {'Hide hints on input fields'}
        </YesNoConfigToggle>
        <YesNoConfigToggle field={'mirrorControls'}>
          {'UI elements swap sides'}
        </YesNoConfigToggle>
      </ConfigToggleGroup>
    </MainDiv>
  );
};

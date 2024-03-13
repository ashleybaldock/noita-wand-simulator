import styled from 'styled-components';
import { useAppDispatch, useConfig } from '../redux/hooks';
import type { ConfigBooleanField, ConfigSection } from '../redux/configSlice';
import {
  disableAllUnlocks,
  enableAllUnlocks,
  toggleConfigSetting,
} from '../redux/configSlice';
import { YesNoToggle } from './Input';
import { Button } from './generic';
import { getUnlockName, unlockConditions } from '../calc/unlocks';
import { useMemo } from 'react';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 10;
  height: 100%;
`;

const ConfigDiv = styled.div`
  columns: 1;
  column-fill: auto;
  column-rule-color: transparent;
  column-rule-style: solid;
  column-rule-width: 2em;

  padding: 0.6em;
  gap: 2em;
  @media screen and (min-width: 500px) {
    columns: min(18em, 30vw) 3;
    height: 80vh;
  }
`;

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

const ToggleWrap = styled.div`
  &::after {
    content: ':';
    padding-right: 1em;
    margin-right: 0.4em;
    flex: 1 1 100%;
    border-bottom: 3px dotted #222;
    height: 0.9em;
  }

  white-space: nowrap;
  display: flex;
  flex: 1 1 auto;

  color: var(--color-toggle-chosen);
  &:hover {
    color: var(--color-toggle-hover);
  }
  text-decoration: none;
`;

const StyledYesNoToggle = styled(YesNoToggle)`
  color: var(--color-toggle-chosen);

  display: flex;
  align-items: last baseline;

  margin: 0.5em 0 0.3em 0.4em;

  &:hover {
    color: var(--color-toggle-hover);
  }
`;

const ConfigToggle = ({
  field,
  children,
}: React.PropsWithChildren<{
  field: ConfigBooleanField;
}>) => {
  const config = useConfig();
  const dispatch = useAppDispatch();

  return (
    <StyledYesNoToggle
      checked={config[field]}
      onChange={() => dispatch(toggleConfigSetting({ name: field }))}
    >
      <ToggleWrap>{children}</ToggleWrap>
    </StyledYesNoToggle>
  );
};

const ConfigToggleGroup = styled(
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
      <div className={className}>
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
  break-inside: avoid-column;
  margin-bottom: 0.5em;

  @media screen and (max-width: 500px) {
    padding-bottom: 1.5em;
    margin-bottom: 0;
  }
  &:first-child {
    margin-top: 1.5em;
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
    <MainDiv>
      <ConfigDiv>
        <ConfigToggleGroup title={'Visualisation'}>
          <ConfigToggle field={'castShowChanged'}>
            {'Hide Unaltered Cast State'}
          </ConfigToggle>
          <ConfigToggle field={'showDurationsInFrames'}>
            {'Show Durations in Frames'}
          </ConfigToggle>
          <ConfigToggle field={'condenseShots'}>
            {'Combine Repeated Actions'}
          </ConfigToggle>
          <ConfigToggle field={'condenseShots'}>
            {'Group Projectiles'}
          </ConfigToggle>
          <ConfigToggle field={'showActionTree'}>
            {'Show Action Tree'}
          </ConfigToggle>
          <ConfigToggle field={'showDirectActionCalls'}>
            {'Show Direct Action Calls'}
          </ConfigToggle>
          <ConfigToggle field={'showDivides'}>
            {'Show Divide By Spells'}
          </ConfigToggle>
          <ConfigToggle field={'showGreekSpells'}>
            {'Show Greek Spells'}
          </ConfigToggle>
          <ConfigToggle field={'showDeckIndexes'}>
            {'Show Deck Indexes'}
          </ConfigToggle>
          <ConfigToggle field={'showRecursion'}>
            {'Show Recursion'}
          </ConfigToggle>
          <ConfigToggle field={'showRecursion'}>
            {'Show Iteration'}
          </ConfigToggle>
          <ConfigToggle field={'showProxies'}>
            {'Show Projectile Proxies'}
          </ConfigToggle>
          <ConfigToggle field={'showSources'}>
            {'Show Action Sources'}
          </ConfigToggle>
          <ConfigToggle field={'showDontDraw'}>
            {'Show Draw Inhibition'}
          </ConfigToggle>
        </ConfigToggleGroup>
        <ConfigToggleGroup title={'Cast Config'}>
          <ConfigToggle field={'unlimitedSpells'}>
            {'Unlimited Spells'}
          </ConfigToggle>
          <ConfigToggle field={'infiniteSpells'}>
            {'Infinite Spells'}
          </ConfigToggle>
        </ConfigToggleGroup>
        {/* <ConfigToggleGroup title={'End Simulation'}> */}
        {/*   <ConfigToggle field={'endSimulationOnRefresh'}> */}
        {/*     {'...on Wand Refresh'} */}
        {/*   </ConfigToggle> */}
        {/* </ConfigToggleGroup> */}
        <ConfigToggleGroup title={'Wand Editor'}>
          <ConfigToggle field={'swapOnMove'}>
            {'Swap Spell Position on move'}
          </ConfigToggle>
          <ConfigToggle field={'showSpellsInCategories'}>
            {'Show Spells in Categories'}
          </ConfigToggle>
          <ConfigToggle field={'showBeta'}>{'Show Beta Spells'}</ConfigToggle>
          <ConfigToggle field={'showExtra'}>{'Show Beta Spells'}</ConfigToggle>
        </ConfigToggleGroup>
        <ConfigToggleGroup
          title={'Unlockable Spells'}
          bulkSelectControls={true}
          section={'unlocks'}
        >
          {sortedUnlocks.map(({ key, name, field }) => (
            <ConfigToggle key={key} field={field}>
              {name}
            </ConfigToggle>
          ))}
        </ConfigToggleGroup>
        <ConfigToggleGroup title={'Accessibility'}>
          <ConfigToggle field={'hideAccessibilityHints'}>
            {'Hide hints on input fields'}
          </ConfigToggle>
        </ConfigToggleGroup>
      </ConfigDiv>
    </MainDiv>
  );
};

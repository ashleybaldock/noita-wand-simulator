import { useAppDispatch, useConfig } from '../../redux/hooks';
import {
  Config,
  updateConfig,
  enableConfigGroup,
  disableConfigGroup,
  ConfigGroupName,
} from '../../redux/configSlice';
import styled from 'styled-components';
import { YesNoToggle } from '../Input';
import { Button } from '../generic';

// ...objectKeys(initialConfigState.config.unlocks).map((unlockField) =>
//   makeConfigField(
//     constToDisplayString(unlockField.replace(/card_unlocked_(.*)/, '$1')),
//     ConfigType.Boolean,
//     (c) => c.unlocks[unlockField],
// (c, v) => (c.unlocks[unlockField] = v),

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 10;
`;

const ConfigDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const ConfigSectionHeading = styled.div`
  font-weight: normal;
  text-transform: uppercase;
  color: var(--color-toggle-label);
`;

const ToggleWrap = styled.div`
  &::after {
    content: ':';
    padding-right: 1em;
    margin-right: 0.4em;
  }

  color: var(--color-toggle-chosen);
  &:hover {
    color: var(--color-toggle-hover);
  }
  text-decoration: none;
`;

const StyledYesNoToggle = styled(YesNoToggle)`
  color: var(--color-toggle-chosen);

  margin: 0.5em 0 0.3em 1em;

  &:hover {
    color: var(--color-toggle-hover);
  }
`;
const ConfigToggle = ({
  field,
  children,
}: React.PropsWithChildren<{
  field: keyof Config;
}>) => {
  const config = useConfig();
  const dispatch = useAppDispatch();

  return (
    <StyledYesNoToggle
      checked={!!config[field]}
      onChange={(e) => dispatch(updateConfig({ [field]: e.target.checked }))}
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
    section?: ConfigGroupName;
    groupName?: string;
    className?: string;
  }>) => {
    return (
      <div className={className}>
        {title && <ConfigSectionHeading>{title}</ConfigSectionHeading>}
        {bulkSelectControls && section && (
          <>
            <Button onClick={() => enableConfigGroup(section)}>
              {'Unlock All'}
            </Button>
            <Button onClick={() => disableConfigGroup(section)}>
              {'Lock All'}
            </Button>
          </>
        )}
        {children}
      </div>
    );
  },
)`
  margin-bottom: 0.5em;
`;

export const ConfigEditor = () => {
  return (
    <MainDiv>
      <ConfigDiv>
        <ConfigToggleGroup title={'Visualisation'}>
          <ConfigToggle field={'castShowChanged'}>
            {'Hide Unaltered Cast State values'}
          </ConfigToggle>
          <ConfigToggle field={'showDurationsInFrames'}>
            {'Show Durations in Frames'}
          </ConfigToggle>
          <ConfigToggle field={'condenseShots'}>
            {'Combine Similar Actions & Projectiles'}
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
            {'Show Recursion and Iteration'}
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
          <ConfigToggle field={'endSimulationOnRefresh'}>
            {'End Simulation on Wand Refresh'}
          </ConfigToggle>
        </ConfigToggleGroup>
        <ConfigToggleGroup title={'Wand Editor'}>
          <ConfigToggle field={'swapOnMove'}>
            {'Swap Spell Position on move'}
          </ConfigToggle>
          <ConfigToggle field={'showSpellsInCategories'}>
            {'Show Spells in Categories'}
          </ConfigToggle>
          <ConfigToggle field={'showBeta'}>{'Show Beta Spells'}</ConfigToggle>
        </ConfigToggleGroup>
        <ConfigToggleGroup
          title={'Unlockable Spells'}
          bulkSelectControls={true}
          section={'unlocks'}
        ></ConfigToggleGroup>
      </ConfigDiv>
    </MainDiv>
  );
};

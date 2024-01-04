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
`;

const ConfigSubtitle = styled.div`
  font-weight: bold;
`;

const ToggleWrap = styled.div`
  &::after {
    content: ':';
    padding-right: 1em;
  }

  color: var(--color-toggle-label);
`;

const StyledYesNoToggle = styled(YesNoToggle)`
  color: var(--color-toggle-chosen);

  &:hover {
    color: var(--color-toggle-hover);
  }

  &:hover::after {
    content: '>';
  }
`;
// const ConfigToggle = ({ configField }: { configField: BooleanConfigField }) => {
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

const ConfigToggleGroup = ({
  title = '',
  bulkSelectControls = false,
  section,
  children,
}: React.PropsWithChildren<{
  title?: string;
  showTitle?: boolean;
  bulkSelectControls?: boolean;
  section?: ConfigGroupName;
  groupName?: string;
}>) => {
  return (
    <div>
      {title && <ConfigSubtitle>{title}</ConfigSubtitle>}
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
};

export const ConfigEditor = () => {
  return (
    <MainDiv>
      <ConfigDiv>
        <ConfigToggleGroup>
          <ConfigToggle field={'condenseShots'}>
            {'Combine Similar Actions and Projectiles'}
          </ConfigToggle>
          <ConfigToggle field={'unlimitedSpells'}>
            {'Unlimited Spells'}
          </ConfigToggle>
          <ConfigToggle field={'infiniteSpells'}>
            {'Infinite Spells'}
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
          <ConfigToggle field={'swapOnMove'}>
            {'Swap When Moving Actions'}
          </ConfigToggle>
          <ConfigToggle field={'showActionTree'}>
            {'Show Action Tree'}
          </ConfigToggle>
          <ConfigToggle field={'showSpellsInCategories'}>
            {'Show Spells in Categories'}
          </ConfigToggle>
          <ConfigToggle field={'endSimulationOnRefresh'}>
            {'End Simulation on Wand Refresh'}
          </ConfigToggle>
          <ConfigToggle field={'showBeta'}>{'Show Beta Spells'}</ConfigToggle>
          <ConfigToggle field={'castShowChanged'}>
            {'Hide Unaltered Cast State values'}
          </ConfigToggle>
          <ConfigToggle field={'showDurationsInFrames'}>
            {'Show Durations in Frames'}
          </ConfigToggle>
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

import styled from 'styled-components';
import { useAppDispatch, useConfig } from '../../redux/hooks';
import type {
  ConfigBooleanField,
  ConfigNumberField,
  ConfigRandom,
  ConfigRequirements,
} from '../../redux/configSlice';
import {
  setConfigSetting,
  toggleConfigSetting,
  updateConfig,
} from '../../redux/configSlice';
import type { ChangeEvent } from 'react';
import { YesNoToggle } from '../Input';
import { SectionToolbar } from '../SectionToolbar';
import { InputImageLabel } from '../Input/ImageLabel/InputImageLabel';
import { RequirementToggle } from '../Input/RequirementToggle/RequirementToggle';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const SubSectionDiv = styled.div<{
  'data-section'?: string;
}>`
  display: flex;
  flex-direction: row;
  flex: 1 1 46%;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  align-self: center;
  align-self: stretch;
  justify-content: start;

  padding: 0;
  margin: 0;
  min-height: 2.3em;
  background-color: #111;
  border: 2px solid #232323;
  border-top-color: var(--config-topleft-border);
  border-left-color: var(--config-topleft-border);
  border-bottom-color: var(--config-bottomright-border);
  border-right-color: var(--config-bottomright-border);
`;

const RequirementsSubSection = styled(SubSectionDiv).attrs(() => ({
  'data-section': 'requirements',
}))`
  flex-direction: column;

  & > :first-child {
    align-self: start;
  }
  & > :last-child {
    flex-wrap: wrap;
  }
`;

const SubSectionTitle = styled.div<{
  minWidth?: string;
}>`
  display: flex;
  flex: 0 1;
  flex-wrap: nowrap;
  justify-content: unset;

  flex-direction: row;
  align-content: center;
  align-items: center;
  align-self: center;

  color: #eee;
  padding: 2px 6px 2px 4px;
  font-size: 14px;
  ${({ minWidth }) => `min-width: ${minWidth ?? '10em'};`}

  object-fit: contain;
  background-size: contain;
  background-repeat: no-repeat;
  white-space: nowrap;

  &:nth-child(1) {
    flex: 0 1;
    object-fit: contain;
    background-size: contain;
    background-repeat: no-repeat;
    white-space: nowrap;
    justify-content: unset;
  }
  &:nth-child(1)::after {
    content: '';
    background-color: red;
    flex: 1;
  }
  &:last-child {
    width: auto;
  }
  &:nth-child(2) {
    flex: 1 0;
  }

  & > span {
    padding-top: 2px;
    white-space: nowrap;
    margin-right: 1.2em;
  }
`;

const SubSectionContent = styled.div<{
  wrapq?: boolean;
  maxWidth?: string;
}>`
  ${({ wrapq = false }) => (wrapq ? 'flex-wrap: wrap;' : '')}
  display: flex;
  align-items: center;
  background-color: #000;
  margin-right: 4px;
  flex: 1 1;
  flex-wrap: wrap;
  width: 100%;
  ${({ maxWidth }) => (maxWidth ? `max-width: ${maxWidth};` : '')}
  gap: 0.2em;

  flex-direction: row;
  align-content: center;
  align-items: center;
  align-self: center;
  flex-wrap: nowrap;
  justify-content: space-between;

  :is([data-section='ending'], [data-section='limits']) & {
    flex: 1 1 auto;
    gap: 1em;
    margin: 0 3em;
  }
`;

const InputWrapper = styled.label`
  display: flex;
  align-items: center;
  color: #eee;
  background-color: #111;
  padding: 1px 1px 1px 3px;
  flex: 1 1 auto;

  &:first-child {
    flex: 1 1 46%;

    object-fit: contain;
    background-size: contain;
    background-repeat: no-repeat;
  }

  input[type='text'],
  input[type='number'] {
    margin: 0 1px 0 5px;
    min-width: 4em;
    max-width: 100%;
    width: 100%;
    flex: 1 1 100%;
    background-color: #222;
    border: var(--input-border);
    border-radius: var(--input-border-radius);
    font-size: 14px;
    color: #fff;
    text-align: center;
    padding: 5px 0 3px 0;
  }

  input[type='text']:focus-visible,
  input[type='number']:focus-visible {
    border: 2px solid #c89e3adb;
    outline: 1px solid #bf8d10cf;
    border: 2px solid #d0ba43;
    outline: 1px solid #dea71bcf;
    background-color: #000;
    outline-style: dashed;
    border-style: inset;
  }

  input[type='checkbox'] {
    margin: 0 6px 0 5px;
  }

  font-size: 14px;

  span {
    text-align: right;
    white-space: nowrap;
    margin-right: 1em;
  }
`;

const CheckboxInputWrapper = styled(InputWrapper)`
  flex: 0 1;

  &:first-child {
    flex: 0 1;
  }
`;

const RandomInputWrapper = styled(InputWrapper)`
  flex: 1 1 46%;
  justify-content: space-evenly;
  width: 100%;

  input[type='text'] {
    min-width: 4em;
  }
`;

const RequiremementEveryOther = styled(RequirementToggle).attrs(() => ({
  sprite: 'data/ui_gfx/gun_actions/if_half.png',
}))``;
const RequiremementIfEnemy = styled(RequirementToggle).attrs(() => ({
  sprite: 'data/ui_gfx/gun_actions/if_enemy.png',
}))``;
const RequiremementIfProjectiles = styled(RequirementToggle).attrs(() => ({
  sprite: 'data/ui_gfx/gun_actions/if_projectile.png',
}))``;
const RequiremementIfHp = styled(RequirementToggle).attrs(() => ({
  sprite: 'data/ui_gfx/gun_actions/if_hp.png',
}))``;

// const SimPaused = styled.span`
//   display: inline-block;
//   width: 4em;
//   padding-left: 4px;
//   font-style: italic;
// `;
// const SimRunning = styled.span`
//   display: inline-block;
//   width: 4em;
//   padding-left: 4px;
// `;

export const CastConfigEditor = () => {
  const config = useConfig();
  const dispatch = useAppDispatch();

  const {
    'requirements.half': half,
    'requirements.enemies': enemies,
    'requirements.hp': hp,
    'requirements.projectiles': projectiles,
  } = config;
  const { 'random.worldSeed': worldSeed, 'random.frameNumber': frameNumber } =
    config;

  const requirementsChangeHandler =
    (field: ConfigBooleanField & keyof ConfigRequirements) => () => {
      dispatch(toggleConfigSetting({ name: field }));
    };
  const randomChangeHandler =
    (field: ConfigNumberField & keyof ConfigRandom) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseInt(e.target.value);
      if (!Number.isInteger(newValue)) {
        return;
      }
      dispatch(
        setConfigSetting({
          name: field,
          newValue,
        }),
      );
    };

  const numberChangeHandler =
    (field: keyof typeof config) => (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseInt(e.target.value);
      if (!Number.isInteger(newValue)) {
        return;
      }
      dispatch(
        updateConfig({
          [field]: Number.parseInt(e.target.value),
        }),
      );
    };

  const handleConfigToggle =
    (field: keyof typeof config) => (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateConfig({
          [field]: e.target.checked,
        }),
      );
    };

  const handleConfigNumericToggle =
    (field: keyof typeof config) => (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateConfig({
          [field]: e.target.checked ? 1 : 0,
        }),
      );
    };

  return (
    <>
      <SectionToolbar title={'Cast Config'} />
      <MainDiv>
        <SubSectionDiv data-section="health">
          <SubSectionTitle>
            <InputImageLabel size={18} imgUrl={'data/config/heart2.png'} />
            <span>Health</span>
          </SubSectionTitle>
          <SubSectionContent>
            <CheckboxInputWrapper>
              <YesNoToggle
                checked={config.infiniteHp}
                onChange={handleConfigToggle('infiniteHp')}
              >
                <span style={{ whiteSpace: 'nowrap' }}>∞: </span>
              </YesNoToggle>
            </CheckboxInputWrapper>
            <InputWrapper>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[1-9][0-9]*$"
                value={config.var_hp}
                onChange={numberChangeHandler('var_hp')}
              />
            </InputWrapper>
            {/* <InputWrapper> */}
            {/*   / */}
            {/*   <input */}
            {/*     type="text" */}
            {/*     inputMode="numeric" */}
            {/*     pattern="^[1-9][0-9]*$" */}
            {/*     value={config.var_hp_max} */}
            {/*     onChange={numberChangeHandler('var_hp_max')} */}
            {/*   /> */}
            {/* </InputWrapper> */}
          </SubSectionContent>
        </SubSectionDiv>
        <SubSectionDiv data-section="money">
          <SubSectionTitle>
            <InputImageLabel size={16} imgUrl={'data/config/goldnugget2.png'} />
            <span>Money</span>
          </SubSectionTitle>
          <SubSectionContent>
            <CheckboxInputWrapper>
              <YesNoToggle
                checked={config.infiniteMoney}
                onChange={handleConfigToggle('infiniteMoney')}
              >
                <span>∞:</span>
              </YesNoToggle>
            </CheckboxInputWrapper>
            <InputWrapper>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[1-9][0-9]*$"
                value={config.var_money}
                onChange={numberChangeHandler('var_money')}
              />
            </InputWrapper>
          </SubSectionContent>
        </SubSectionDiv>
        <SubSectionDiv data-section="random">
          <SubSectionTitle minWidth={'auto'}>
            <InputImageLabel size={16} imgUrl={'data/config/die2.png'} />
            <span>Random</span>
          </SubSectionTitle>
          <SubSectionContent wrapq={true} maxWidth={'calc(100% - 2.2em)'}>
            <RandomInputWrapper>
              <span>Seed</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[1-9][0-9]*$"
                value={worldSeed}
                onChange={randomChangeHandler('random.worldSeed')}
              />
            </RandomInputWrapper>
            <RandomInputWrapper>
              <span>Frame:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[1-9][0-9]*$"
                value={frameNumber}
                onChange={randomChangeHandler('random.frameNumber')}
              />
            </RandomInputWrapper>
          </SubSectionContent>
        </SubSectionDiv>
        <RequirementsSubSection>
          <SubSectionTitle>
            <InputImageLabel size={18} imgUrl={'data/config/req.png'} />
            <span>Requirements</span>
          </SubSectionTitle>
          <SubSectionContent wrapq={true}>
            {/* <YesNoToggleWithoutArrow */}
            {/*   checked={half} */}
            {/*   onChange={requirementsChangeHandler('requirements.half')} */}
            {/* > */}
            {/*   <InputImageLabel */}
            {/*     leftMargin={'6px'} */}
            {/*     size={32} */}
            {/*     imgUrl={'data/ui_gfx/gun_actions/if_half.png'} */}
            {/*   /> */}
            {/* </YesNoToggleWithoutArrow> */}
            <RequiremementEveryOther
              checked={half}
              onChange={requirementsChangeHandler('requirements.half')}
              customYes={<>1st</>}
              customNo={<>2nd</>}
            />
            <RequiremementIfEnemy
              checked={enemies}
              onChange={requirementsChangeHandler('requirements.enemies')}
              customYes={<>Cast</>}
              customNo={<>Skip</>}
            />
            <RequiremementIfProjectiles
              checked={projectiles}
              onChange={requirementsChangeHandler('requirements.projectiles')}
              customYes={<>Cast</>}
              customNo={<>Skip</>}
            />
            <RequiremementIfHp
              checked={hp}
              onChange={requirementsChangeHandler('requirements.hp')}
              customYes={<>Cast</>}
              customNo={<>Skip</>}
            />
          </SubSectionContent>
        </RequirementsSubSection>
        <SubSectionDiv data-section="limits">
          <SubSectionTitle>
            <span>Limits</span>
          </SubSectionTitle>
          <SubSectionContent>
            <CheckboxInputWrapper>
              <YesNoToggle
                checked={config.unlimitedSpells}
                onChange={handleConfigToggle('unlimitedSpells')}
              >
                <span>Unlimited Spells Perk</span>
              </YesNoToggle>
            </CheckboxInputWrapper>
            <CheckboxInputWrapper>
              <YesNoToggle
                checked={config.infiniteSpells}
                onChange={handleConfigToggle('infiniteSpells')}
              >
                <span>∞ Spells (Ignore usage limits)</span>
              </YesNoToggle>
            </CheckboxInputWrapper>
          </SubSectionContent>
        </SubSectionDiv>
        <SubSectionDiv data-section="ending">
          <SubSectionTitle>
            <span>End Simulation after:</span>
          </SubSectionTitle>
          <SubSectionContent>
            <CheckboxInputWrapper>
              <YesNoToggle
                checked={config.endSimulationOnShotCount > 0}
                onChange={handleConfigNumericToggle('endSimulationOnShotCount')}
              >
                <span>A single shot</span>
              </YesNoToggle>
            </CheckboxInputWrapper>
            <CheckboxInputWrapper>
              <YesNoToggle
                checked={config.endSimulationOnReloadCount > 0}
                onChange={handleConfigNumericToggle(
                  'endSimulationOnReloadCount',
                )}
              >
                <span>Reload</span>
              </YesNoToggle>
            </CheckboxInputWrapper>
            <CheckboxInputWrapper>
              <YesNoToggle
                checked={config.endSimulationOnRefreshCount > 0}
                onChange={handleConfigNumericToggle(
                  'endSimulationOnRefreshCount',
                )}
              >
                <span>Wand Refresh</span>
              </YesNoToggle>
            </CheckboxInputWrapper>
            <CheckboxInputWrapper>
              <YesNoToggle
                checked={config.endSimulationOnRepeatCount > 0}
                onChange={handleConfigNumericToggle(
                  'endSimulationOnRepeatCount',
                )}
              >
                <span>Repeat</span>
              </YesNoToggle>
            </CheckboxInputWrapper>
          </SubSectionContent>
        </SubSectionDiv>
        {/* <SubSectionDiv> */}
        {/*   <SubSectionTitle>Simulation: {config.pauseCalculations ? <SimPaused>Paused</SimPaused> : <SimRunning>Running</SimRunning>}</SubSectionTitle> */}
        {/*   <SubSectionContent> */}
        {/*     <InputWrapper> */}
        {/*       <CheckboxWrapper> */}
        {/*         <input */}
        {/*           type="checkbox" */}
        {/*           checked={config.pauseCalculations} */}
        {/*           onChange={handleConfigToggle('pauseCalculations')} */}
        {/*         /> */}
        {/*       </CheckboxWrapper> */}
        {/*     </InputWrapper> */}
        {/*   </SubSectionContent> */}
        {/* </SubSectionDiv> */}
      </MainDiv>
    </>
  );
};

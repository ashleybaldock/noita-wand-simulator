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
import { RequirementToggle } from '../Input/RequirementToggle/RequirementToggle';
import { InputImageLabel } from '../Input/ImageLabel/InputImageLabel';
import { NumericInput } from '../Input/NumericInput/NumericInput';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #000;
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
  background-color: #000;
  border: 2px solid #232323;
  border-top-color: var(--config-topleft-border);
  border-left-color: var(--config-topleft-border);
  border-bottom-color: var(--config-bottomright-border);
  border-right-color: var(--config-bottomright-border);

  @media screen and (max-width: 600px) {
    flex-direction: column;
    gap: 0;
    padding: 0;
    margin: 0;
    padding-bottom: 0.4em;
  }
`;

const RequirementsSubSection = styled(SubSectionDiv).attrs(() => ({
  'data-section': 'requirements',
}))`
  flex-direction: row;
  align-content: unset;
  align-items: unset;
  align-self: unset;
  justify-content: unset;

  & > :first-child {
    align-self: start;
  }
  & > :last-child {
    flex-wrap: wrap;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
    row-gap: 0.2em;
    column-gap: 0;
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

  ${({ minWidth }) => `min-width: ${minWidth ?? '8em'};`}

  object-fit: contain;
  background-size: contain;
  background-repeat: no-repeat;
  white-space: nowrap;
  background-color: #000;

  &:nth-child(1) {
    flex: 0 1;
    object-fit: contain;
    background-size: contain;
    background-repeat: no-repeat;
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

  @media screen and (max-width: 600px) {
    flex-direction: column;
    gap: 0;
    padding: 0.4em;
    margin: 0;
    align-self: start;
    align-items: start;
    border: none;
    flex-direction: row;
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
  padding: 0;
  margin-right: 4px;
  flex: 1 1 auto;
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

  @media screen and (min-width: 600px) {
    padding: 0.2em;

    :is([data-section='ending'], [data-section='limits']) & {
      flex-wrap: wrap;
      flex: 1 1 auto;
      margin: 0 3em;
      column-gap: 2em;
      row-gap: 0;
      & > label {
        flex-basis: 40%;
      }
    }
  }

  @media screen and (max-width: 600px) {
    :is([data-section='ending'], [data-section='limits']) & {
      flex-direction: column;
      gap: 0;
    }
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

  @media screen and (max-width: 600px) {
    padding: 0 1.8em;
    flex: 1 1 100%;
    align-self: stretch;
  }
`;

const WrappedYesNoToggle = styled(YesNoToggle)`
  flex: 0 1;
  padding: 0.6em 0.2em;
  flex: 1 1 100%;

  & :first-child {
    flex: 1 0;
  }
  & :last-child {
    flex: 0 0;
  }
  @media screen and (max-width: 600px) {
    align-self: stretch;
    padding: 0.6em 1.8em;

    & :first-child {
      flex: 1 0;
    }
    & :last-child {
      flex: 0 0;
    }
    & :last-child::before {
    }
  }
`;

const RandomInputWrapper = styled(InputWrapper)`
  flex: 1 1 46%;
  justify-content: space-evenly;

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
            <InputImageLabel size={22} imgUrl={'data/config/heart2.png'} />
            <span>Health</span>
          </SubSectionTitle>
          <SubSectionContent>
            {/* <CheckboxInputWrapper> */}
            {/*   <YesNoToggle */}
            {/*     checked={config.infiniteHp} */}
            {/*     onChange={handleConfigToggle('infiniteHp')} */}
            {/*   > */}
            {/*     <span style={{ whiteSpace: 'nowrap' }}>∞: </span> */}
            {/*   </YesNoToggle> */}
            {/* </CheckboxInputWrapper> */}
            <NumericInput
              min={0}
              max={Number.POSITIVE_INFINITY}
              value={config.var_hp}
              onChange={numberChangeHandler('var_hp')}
            ></NumericInput>
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
            <InputImageLabel size={20} imgUrl={'data/config/goldnugget2.png'} />
            <span>Money</span>
          </SubSectionTitle>
          <SubSectionContent>
            <NumericInput
              min={0}
              max={Number.POSITIVE_INFINITY}
              // type="text"
              // inputMode="numeric"
              // pattern="^[1-9][0-9]*$"
              value={config.var_money}
              onChange={numberChangeHandler('var_money')}
            ></NumericInput>
            {/* <CheckboxInputWrapper> */}
            {/*   <YesNoToggle */}
            {/*     checked={config.infiniteMoney} */}
            {/*     onChange={handleConfigToggle('infiniteMoney')} */}
            {/*   > */}
            {/*     <span>∞:</span> */}
            {/*   </YesNoToggle> */}
            {/* </CheckboxInputWrapper> */}
          </SubSectionContent>
        </SubSectionDiv>
        <SubSectionDiv data-section="random">
          <SubSectionTitle>
            <InputImageLabel size={22} imgUrl={'data/config/die2.png'} />
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
            <InputImageLabel size={22} imgUrl={'data/config/req.png'} />
            <span>Requirements</span>
          </SubSectionTitle>
          <SubSectionContent wrapq={true}>
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
            <WrappedYesNoToggle
              checked={config.unlimitedSpells}
              onChange={handleConfigToggle('unlimitedSpells')}
            >
              <span>Unlimited Spells Perk</span>
            </WrappedYesNoToggle>
            <WrappedYesNoToggle
              checked={config.infiniteSpells}
              onChange={handleConfigToggle('infiniteSpells')}
            >
              <span>∞ Spells (Ignore usage limits)</span>
            </WrappedYesNoToggle>
          </SubSectionContent>
        </SubSectionDiv>
        <SubSectionDiv data-section="ending">
          <SubSectionTitle>
            <span>End Simulation after:</span>
          </SubSectionTitle>
          <SubSectionContent>
            <WrappedYesNoToggle
              checked={config.endSimulationOnShotCount > 0}
              onChange={handleConfigNumericToggle('endSimulationOnShotCount')}
            >
              <span>A single shot</span>
            </WrappedYesNoToggle>
            <WrappedYesNoToggle
              checked={config.endSimulationOnReloadCount > 0}
              onChange={handleConfigNumericToggle('endSimulationOnReloadCount')}
            >
              <span>Reload</span>
            </WrappedYesNoToggle>
            <WrappedYesNoToggle
              checked={config.endSimulationOnRefreshCount > 0}
              onChange={handleConfigNumericToggle(
                'endSimulationOnRefreshCount',
              )}
            >
              <span>Wand Refresh</span>
            </WrappedYesNoToggle>
            <WrappedYesNoToggle
              checked={config.endSimulationOnRepeatCount > 0}
              onChange={handleConfigNumericToggle('endSimulationOnRepeatCount')}
            >
              <span>Repeat</span>
            </WrappedYesNoToggle>
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

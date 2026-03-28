import { useAppDispatch, useWand } from '../../redux/hooks';
import { setWand } from '../../redux/wandSlice';
import styled from 'styled-components';
import { round, toSeconds } from '../../util/util';
import { useConfig } from '../../redux';
import { YesNoConfigToggle, YesNoToggle } from '../Input';
import {
  FNSP,
  PREFIX_MULTI,
  SUFFIX_DEGREE,
  SUFFIX_FRAME,
  SUFFIX_SECOND,
} from '../../util';
import { NumericInput } from '../Input/NumericInput/NumericInput';
import { useSprite, type Sprite } from '../../calc/sprite';
import { EditableWrapper } from '../Presentation';
import { WandStatName } from './WandStatName';

const EditableInterval = ({
  field,
}: {
  field: 'cast_delay' | 'reload_time';
}) => {
  const { showDurationsInFrames: frames } = useConfig();
  const wand = useWand();
  const dispatch = useAppDispatch();
  return (
    <NumericInput
      value={wand[field]}
      setValue={(value) =>
        dispatch(setWand({ wand: { ...wand, [field]: value } }))
      }
      onChange={() => {}}
      minStep={frames ? 1 : 0.01}
      step={frames ? 1 : 0.01}
      smallest={-60}
      largest={1000}
      setLargestButton={false}
      setLargeButton={false}
      formatForDisplay={
        frames
          ? (v) => `${Math.round(v)}${FNSP}${SUFFIX_FRAME}`
          : (v) => `${toSeconds(v)}${FNSP}${SUFFIX_SECOND}`
      }
      parseInput={
        frames
          ? (v) => Math.round(parseInt(v, 10))
          : (v) => toSeconds(parseInt(v, 10))
      }
    ></NumericInput>
  );
};

const StyledListItem = styled(EditableWrapper)<{
  sprite?: Sprite;
}>`
  grid-column: auto/span 1;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;

  align-content: center;
  align-items: center;
  height: auto;

  ${({ sprite }) =>
    sprite &&
    `
  background-image: ${sprite.path};
  background-position: 0.6em 50%;
  background-size: 1em;
  background-repeat: no-repeat;
  `}
  image-rendering: pixelated;
  font-family: var(--font-family-noita-default);
  font-size: 1em;
  color: var(--color-base);
  padding: 0 0.6em 0 2.2em;

  @media screen and (max-width: 500px) {
    font-size: 1.2em;
  }
`;

const StyledValue = styled.span`
  text-align: right;
  display: flex;
  flex: 1 1 auto;
  white-space: nowrap;
`;

const StyledYesNoToggle = styled(YesNoToggle)``;

export const WandStatsEditor = ({ className = '' }: { className?: string }) => {
  const wand = useWand();
  const dispatch = useAppDispatch();

  return (
    <>
      <StyledYesNoToggle
        sprite={useSprite('icon.wand.shuffle')}
        tip={{ kind: 'uihint', id: 'shuffle_deck_when_empty' }}
        dataName="EditStatShuffle"
        checked={false && wand.shuffle_deck_when_empty}
        onChange={(e) =>
          dispatch(
            setWand({
              wand: {
                ...wand,
                shuffle_deck_when_empty: e.target.checked,
              },
            }),
          )
        }
      >
        <WandStatName>{'Shuffle'}</WandStatName>
      </StyledYesNoToggle>
      <StyledListItem
        className={className}
        sprite={useSprite('icon.wand.capacity')}
        tip={{ kind: 'uihint', id: 'deck_capacity' }}
        dataName="EditStatCapacity"
      >
        <WandStatName>{'Capacity'}</WandStatName>
        <StyledValue>
          <NumericInput
            value={wand.deck_capacity}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, deck_capacity: value } }))
            }
            onChange={() => {}}
            minStep={1}
            smallest={1}
            largest={512}
            large={26}
            setLargestButton={false}
            setLargeButton={true}
          ></NumericInput>
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        sprite={useSprite('icon.wand.spellscast')}
        tip={{ kind: 'uihint', id: 'actions_per_round' }}
        dataName="EditStatSpellsCast"
      >
        <WandStatName>{'Spells/Cast'}</WandStatName>
        <StyledValue>
          <NumericInput
            value={wand.actions_per_round}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, actions_per_round: value } }))
            }
            onChange={() => {}}
            minStep={1}
            smallest={1}
            large={26}
            bigStep={10}
            largest={512}
            setLargestButton={false}
            setLargeButton={true}
          ></NumericInput>
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        sprite={useSprite('icon.wand.castdelay')}
        tip={{ kind: 'uihint', id: 'cast_delay' }}
      >
        <WandStatName>{'Cast delay'}</WandStatName>
        <StyledValue>
          <EditableInterval field="cast_delay" />
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        sprite={useSprite('icon.wand.reloadtime')}
        tip={{ kind: 'uihint', id: 'reload_time' }}
      >
        <WandStatName>{'Recharge Time'}</WandStatName>
        <StyledValue>
          <EditableInterval field="reload_time" />
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        sprite={useSprite('icon.wand.manamax')}
        tip={{ kind: 'uihint', id: 'mana_max' }}
      >
        <WandStatName>{'Mana max'}</WandStatName>
        <StyledValue>
          <NumericInput
            value={wand.mana_max}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, mana_max: value } }))
            }
            onChange={() => {}}
            smallest={0}
            large={3000}
            step={10}
            bigStep={1000}
            largest={60000}
            setLargestButton={false}
            setLargeButton={true}
          ></NumericInput>
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        sprite={useSprite('icon.wand.regen')}
        tip={{ kind: 'uihint', id: 'mana_charge_speed' }}
      >
        <WandStatName>{'Mana Charge Speed'}</WandStatName>
        <StyledValue>
          <NumericInput
            value={wand.mana_charge_speed}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, mana_charge_speed: value } }))
            }
            onChange={() => {}}
            smallest={0}
            large={3000}
            step={10}
            bigStep={1000}
            largest={60000}
            setLargestButton={false}
            setLargeButton={true}
          ></NumericInput>
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        sprite={useSprite('icon.wand.spread')}
        tip={{ kind: 'uihint', id: 'wand_spread' }}
      >
        <WandStatName>{'Spread'}</WandStatName>
        <StyledValue>
          <NumericInput
            value={wand.spread}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, spread: value } }))
            }
            formatForDisplay={(v) =>
              `${round(Number(v), 1)}${FNSP}${SUFFIX_DEGREE}`
            }
            onChange={() => {}}
            smallest={0}
            large={3000}
            step={10}
            bigStep={1000}
            largest={60000}
            setLargestButton={false}
            setLargeButton={true}
          ></NumericInput>
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        data-name={'EditSpeed'}
        sprite={useSprite('icon.wand.speed')}
        tip={{ kind: 'uihint', id: 'wand_speed' }}
      >
        <WandStatName>{'Speed'}</WandStatName>
        <StyledValue>
          <NumericInput
            value={wand.speed}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, speed: value } }))
            }
            formatForDisplay={(v) =>
              `${PREFIX_MULTI}${FNSP}${round(Number(v), 1)}`
            }
            onChange={() => {}}
            smallest={0}
            large={2}
            step={0.1}
            bigStep={0.5}
            largest={10}
            setLargestButton={false}
            setLargeButton={true}
          ></NumericInput>
        </StyledValue>
      </StyledListItem>

      <YesNoConfigToggle
        sprite={useSprite('icon.unlimitedspells')}
        className={className}
        tip={{ kind: 'uihint', id: 'unlimited_spells' }}
        dataName="ToggleUnlimitedSpells"
        data-toggle="unlimitedSpells"
        configField={'unlimitedSpells'}
      ></YesNoConfigToggle>
    </>
  );
};

import { useAppDispatch, useWand } from '../../redux/hooks';
import { setWand } from '../../redux/wandSlice';
import styled from 'styled-components';
import type { AppDispatch } from '../../redux/store';
import { EditableInteger } from '../generic';
import type { TypedProperties } from '../../util/util';
import { round, toSeconds } from '../../util/util';
import { useConfig } from '../../redux';
import { YesNoToggle } from '../Input';
import {
  FNSP,
  PREFIX_MULTI,
  SUFFIX_DEGREE,
  SUFFIX_FRAME,
  SUFFIX_SECOND,
} from '../../util';
import type { Wand } from '../../redux/Wand/wand';
import { useId } from 'react';
import { NumericInput } from '../Input/NumericInput/NumericInput';
import { EditableWithLabel } from '../Presentation/Editable';
import type { SpriteName } from '../../calc/sprite';

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
      smallest={-60}
      largest={1000}
      setLargestButton={false}
      setLargeButton={false}
      step={frames ? 1 : 0.01}
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

const StyledListItem = styled(EditableWithLabel)<{
  /**
   * @deprecated use @param {icon} instead
   */
  imgUrl: string;
  icon?: SpriteName;
}>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;

  height: calc(var(--child-unit-height) * 1);

  background-image: url('/${({ imgUrl }) => imgUrl}');
  background-position: 0.6em 50%;
  background-size: 1em;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  font-family: var(--font-family-noita-default);
  font-size: 16px;
  color: var(--color-button);
  padding: 0.3em 0.6em 0.2em 2.2em;
`;
const StyledName = styled.div`
  text-align: left;
  flex: 0 1 auto;
  width: 7.4em;
  white-space: nowrap;

  width: 100%;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    border-bottom: 3px dotted #222222;
    height: 0.7em;
    display: inline-block;
    flex: 1 1 auto;
  }
`;
const StyledValue = styled.span`
  text-align: right;
  display: flex;
  flex: 1 1 auto;
  white-space: nowrap;
  min-width: 5em;
  width: 10em;
`;

export const WandStatsEditor = ({ className = '' }: { className?: string }) => {
  const wand = useWand();
  const dispatch = useAppDispatch();

  const id = useId();

  return (
    <>
      <StyledListItem
        imgUrl={'data/wand/icon_gun_shuffle.png'}
        className={className}
        $tip={{ kind: 'uihint', id: 'shuffle_deck_when_empty' }}
        $dataName="EditStatShuffle"
      >
        <StyledName>{'Shuffle'}</StyledName>
        <StyledValue>
          <YesNoToggle
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
          />
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_gun_capacity.png'}
        $tip={{ kind: 'uihint', id: 'deck_capacity' }}
        $dataName="EditStatCapacity"
      >
        <StyledName>{'Capacity'}</StyledName>
        <StyledValue>
          <NumericInput
            value={wand.deck_capacity}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, deck_capacity: value } }))
            }
            onChange={() => {}}
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
        imgUrl={'data/wand/icon_gun_actions_per_round.png'}
        $tip={{ kind: 'uihint', id: 'actions_per_round' }}
        $dataName="EditStatSpellsCast"
      >
        <StyledName>{'Spells/Cast'}</StyledName>
        <StyledValue>
          <NumericInput
            value={wand.actions_per_round}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, actions_per_round: value } }))
            }
            onChange={() => {}}
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
        imgUrl={'data/wand/icon_fire_rate_wait.png'}
        $tip={{ kind: 'uihint', id: 'cast_delay' }}
      >
        <StyledName>{'Cast delay'}</StyledName>
        <StyledValue>
          <EditableInterval field="cast_delay" />
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_gun_reload_time.png'}
        $tip={{ kind: 'uihint', id: 'reload_time' }}
      >
        <StyledName>{'Recharge Time'}</StyledName>
        <StyledValue>
          <EditableInterval field="reload_time" />
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_mana_max.png'}
        $tip={{ kind: 'uihint', id: 'mana_max' }}
      >
        <StyledName>{'Mana max'}</StyledName>
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
        imgUrl={'data/wand/icon_mana_charge_speed.png'}
        $tip={{ kind: 'uihint', id: 'mana_charge_speed' }}
      >
        <StyledName>{'Mana Charge Speed'}</StyledName>
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
        imgUrl={'data/wand/icon_spread_degrees.png'}
        $tip={{ kind: 'uihint', id: 'wand_spread' }}
      >
        <StyledName>{'Spread'}</StyledName>
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
        imgUrl={'data/wand/icon_speed_multiplier.png'}
        $tip={{ kind: 'uihint', id: 'wand_speed' }}
      >
        <StyledName>{'Speed'}</StyledName>
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
    </>
  );
};

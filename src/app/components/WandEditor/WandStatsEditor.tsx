import { useAppDispatch, useWand } from '../../redux/hooks';
import { setWand } from '../../redux/wandSlice';
import styled from 'styled-components';
import type { AppDispatch } from '../../redux/store';
import { EditableInteger } from '../generic';
import type { TypedProperties } from '../../util/util';
import { round, toFrames, toSeconds } from '../../util/util';
import { useConfig } from '../../redux';
import { YesNoToggle } from '../Input';
import { FNSP, SUFFIX_DEGREE, SUFFIX_FRAME, SUFFIX_SECOND } from '../../util';
import type { Wand } from '../../redux/Wand/wand';
import { useId } from 'react';
import { NumericInput } from '../Input/NumericInput/NumericInput';

type NumberFieldProps = {
  field: keyof TypedProperties<Wand, number>;
  step?: number;
  formatValue?: (value: number) => string;
  convertRawValue?: (rawValue: number) => number;
  convertDisplayValue?: (displayValue: number) => number;
};

const renderNumberField =
  ({
    field,
    step,
    formatValue,
    convertRawValue,
    convertDisplayValue,
  }: NumberFieldProps) =>
  (wand: Wand, dispatch: AppDispatch) => {
    return (
      <EditableInteger
        value={wand[field]}
        onChange={(value) =>
          dispatch(
            setWand({
              wand: { ...wand, [field]: value },
            }),
          )
        }
        step={step}
        formatValue={formatValue}
        convertRawValue={convertRawValue}
        convertDisplayValue={convertDisplayValue}
      />
    );
  };

const EditableInterval = ({
  field,
}: {
  field: 'cast_delay' | 'reload_time';
}) => {
  const { showDurationsInFrames: frames } = useConfig();
  const wand = useWand();
  const dispatch = useAppDispatch();
  return (
    <EditableInteger
      value={wand[field]}
      onChange={(value) =>
        dispatch(
          setWand({
            wand: { ...wand, [field]: value },
          }),
        )
      }
      step={frames ? 1 : 0.01}
      formatValue={
        frames
          ? (v) => `${Math.round(v)}${FNSP}${SUFFIX_FRAME}`
          : (v) => `${toSeconds(v)}${FNSP}${SUFFIX_SECOND}`
      }
      convertRawValue={frames ? (v) => Math.round(v) : toSeconds}
      convertDisplayValue={frames ? (v) => Math.round(v) : toFrames}
    />
  );
};

const StyledListItem = styled.label<{
  imgUrl: string;
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
      >
        <StyledName>{'Shuffle'}</StyledName>
        <StyledValue>
          <YesNoToggle
            checked={wand.shuffle_deck_when_empty}
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
      >
        <StyledName>{'Capacity'}</StyledName>
        <StyledValue>
          <NumericInput
            value={wand.deck_capacity}
            setValue={(value) =>
              dispatch(setWand({ wand: { ...wand, deck_capacity: value } }))
            }
            onChange={() => {}}
            min={1}
            max={512}
            large={26}
            showSetToMax={false}
            showSetToLarge={true}
          ></NumericInput>
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_gun_actions_per_round.png'}
      >
        <StyledName>{'Spells/Cast'}</StyledName>
        <StyledValue>
          {renderNumberField({ field: 'actions_per_round' })(wand, dispatch)}
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_fire_rate_wait.png'}
      >
        <StyledName>{'Cast delay'}</StyledName>
        <StyledValue>
          <EditableInterval field="cast_delay" />
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_gun_reload_time.png'}
      >
        <StyledName>{'Recharge'}</StyledName>
        <StyledValue>
          <EditableInterval field="reload_time" />
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_mana_max.png'}
      >
        <StyledName>{'Mana Max'}</StyledName>
        <StyledValue>
          {renderNumberField({ field: 'mana_max' })(wand, dispatch)}
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_mana_charge_speed.png'}
      >
        <StyledName>{'Mana Regen'}</StyledName>
        <StyledValue>
          {renderNumberField({ field: 'mana_charge_speed' })(wand, dispatch)}
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_spread_degrees.png'}
      >
        <StyledName>{'Spread'}</StyledName>
        <StyledValue>
          {renderNumberField({
            field: 'spread',
            formatValue: (v) => `${round(Number(v), 1)}${FNSP}${SUFFIX_DEGREE}`,
          })(wand, dispatch)}
        </StyledValue>
      </StyledListItem>
      <StyledListItem
        className={className}
        imgUrl={'data/wand/icon_speed_multiplier.png'}
      >
        <StyledName>{'Speed'}</StyledName>
        <StyledValue>
          {renderNumberField({
            field: 'speed',
            formatValue: (v) => `${round(Number(v), 1)}`,
          })(wand, dispatch)}
        </StyledValue>
      </StyledListItem>
    </>
  );
};

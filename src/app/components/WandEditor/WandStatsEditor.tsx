import { useAppDispatch, useWand } from '../../redux/hooks';
import { setWand } from '../../redux/wandSlice';
import styled from 'styled-components';
import type { AppDispatch } from '../../redux/store';
import { EditableInteger } from '../generic';
import type { TypedProperties } from '../../util/util';
import { round, toFrames, toSeconds } from '../../util/util';
import type { Config } from '../../redux';
import { useConfig } from '../../redux';
import { YesNoToggle } from '../Input';
import { FNSP, SUFFIX_DEGREE, SUFFIX_FRAME, SUFFIX_SECOND } from '../../util';
import type { Wand } from '../../redux/Wand/wand';

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
  (wand: Wand, dispatch: AppDispatch, config: Config) => {
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

const fields = [
  {
    name: 'Shuffle',
    imgUrl: 'data/wand/icon_gun_shuffle.png',
    render: (wand: Wand, dispatch: AppDispatch, config: Config) => (
      <YesNoToggle
        checked={wand.shuffle_deck_when_empty}
        onChange={(e) =>
          dispatch(
            setWand({
              wand: { ...wand, shuffle_deck_when_empty: e.target.checked },
            }),
          )
        }
      />
    ),
  },
  {
    name: 'Capacity',
    imgUrl: 'data/wand/icon_gun_capacity.png',
    render: renderNumberField({ field: 'deck_capacity' }),
  },
  {
    name: 'Spells/Cast',
    imgUrl: 'data/wand/icon_gun_actions_per_round.png',
    render: renderNumberField({ field: 'actions_per_round' }),
  },
  {
    name: 'Cast delay',
    imgUrl: 'data/wand/icon_fire_rate_wait.png',
    render: () => {
      return <EditableInterval field="cast_delay" />;
    },
  },
  {
    name: 'Recharge',
    imgUrl: 'data/wand/icon_gun_reload_time.png',
    render: () => {
      return <EditableInterval field="reload_time" />;
    },
  },
  {
    name: 'Mana Max',
    imgUrl: 'data/wand/icon_mana_max.png',
    render: renderNumberField({ field: 'mana_max' }),
  },
  {
    name: 'Mana Regen',
    imgUrl: 'data/wand/icon_mana_charge_speed.png',
    render: renderNumberField({ field: 'mana_charge_speed' }),
  },
  {
    name: 'Spread',
    imgUrl: 'data/wand/icon_spread_degrees.png',
    render: renderNumberField({
      field: 'spread',
      formatValue: (v) => `${round(Number(v), 1)}${FNSP}${SUFFIX_DEGREE}`,
    }),
  },
  {
    name: 'Speed',
    imgUrl: 'data/wand/icon_speed_multiplier.png',
    render: renderNumberField({
      field: 'speed',
      formatValue: (v) => `${round(Number(v), 1)}`,
    }),
  },
];

const StyledList = styled.div`
  align-self: center;
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 1.3em;
  grid-template-columns: repeat(1, 1fr);
  width: min-content;
  max-height: calc(var(--sizes-spelledit-spell-total) * 4);
  height: min-content;

  @media screen and (max-width: 800px) {
    grid-auto-flow: column;
    grid-template-rows: repeat(5, 1fr);
    grid-template-columns: repeat(2, 1fr);
    min-width: 40vw;
    width: fit-content;
  }

  @media screen and (max-width: 500px) {
    justify-items: center;
    grid-template-rows: repeat(9, 1fr);
    grid-template-columns: repeat(1, 1fr);
    min-width: 60vw;
    width: 100%;
  }
`;
const StyledListItem = styled.div<{
  imgUrl: string;
}>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  background-image: url('/${({ imgUrl }) => imgUrl}');
  background-position: 0.6em 50%;
  background-size: 1em;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  font-family: var(--font-family-noita-default);
  font-size: 16px;
  color: var(--color-button);
  padding: 0.1em 0.6em 0em 2.2em;
`;
const StyledName = styled.span`
  text-align: left;
  flex: 0 1 auto;
  width: 7.4em;
  white-space: nowrap;
`;
const StyledValue = styled.span`
  text-align: left;
  flex: 1 0;
  white-space: nowrap;
  min-width: 3.4em;
  width: 5em;
`;

export function WandStatsEditor() {
  const wand = useWand();
  const dispatch = useAppDispatch();
  const config = useConfig();

  return (
    <StyledList>
      {fields.map(({ name, imgUrl, render }, index) => (
        <StyledListItem key={name} imgUrl={imgUrl}>
          <StyledName>{name}</StyledName>
          <StyledValue>{render(wand, dispatch, config)}</StyledValue>
        </StyledListItem>
      ))}
    </StyledList>
  );
}

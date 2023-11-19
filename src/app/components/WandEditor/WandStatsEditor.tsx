import { useAppDispatch } from '../../redux/hooks';
import { useWand, setWand } from '../../redux/wandSlice';
import { Wand } from '../../types';
import styled from 'styled-components/macro';
import { AppDispatch } from '../../redux/store';
import { EditableInteger } from '../generic';
import { round, toFrames, toSeconds, TypedProperties } from '../../util/util';
import { Config, useConfig } from '../../redux';

const CheckboxField = styled.input`
  margin: 1px;
`;

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

const fields = [
  {
    name: 'Shuffle',
    imgUrl: 'data/wand/icon_gun_shuffle.png',
    render: (wand: Wand, dispatch: AppDispatch, config: Config) => (
      <CheckboxField
        type="checkbox"
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
    name: 'Spells/Cast',
    imgUrl: 'data/wand/icon_gun_actions_per_round.png',
    render: renderNumberField({ field: 'actions_per_round' }),
  },
  {
    name: 'Cast delay',
    imgUrl: 'data/wand/icon_fire_rate_wait.png',
    render: renderNumberField({
      field: 'cast_delay',
      step: 0.01,
      formatValue: (v) => `${toSeconds(v)} s`,
      convertRawValue: toSeconds,
      convertDisplayValue: toFrames,
    }),
  },
  {
    name: 'Rechrg. Time',
    imgUrl: 'data/wand/icon_gun_reload_time.png',
    render: renderNumberField({
      field: 'reload_time',
      step: 0.01,
      formatValue: (v) => `${toSeconds(v)} s`,
      convertRawValue: toSeconds,
      convertDisplayValue: toFrames,
    }),
  },
  {
    name: 'Mana max',
    imgUrl: 'data/wand/icon_mana_max.png',
    render: renderNumberField({ field: 'mana_max' }),
  },
  {
    name: 'Mana chg. Spd',
    imgUrl: 'data/wand/icon_mana_charge_speed.png',
    render: renderNumberField({ field: 'mana_charge_speed' }),
  },
  {
    name: 'Capacity',
    imgUrl: 'data/wand/icon_gun_capacity.png',
    render: renderNumberField({ field: 'deck_capacity' }),
  },
  {
    name: 'Spread',
    imgUrl: 'data/wand/icon_spread_degrees.png',
    render: renderNumberField({
      field: 'spread',
      formatValue: (v) => `${round(Number(v), 1)} DEG`,
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
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 1.3em;
  grid-template-columns: repeat(1, 1fr);
  width: min-content;
  max-height: calc(var(--sizes-spelledit-spell-total) * 4);
  height: min-content;

  @media screen and (max-width: 900px) {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    min-width: 30vw;
  }

  @media screen and (max-width: 700px) {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(5, 1fr);
    min-width: 40vw;
  }

  @media screen and (max-width: 500px) {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(9, 1fr);
    min-width: 60vw;
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

  @media screen and (max-width: 700px) {
  }
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
  width: 3.4em;
`;

export function WandStatsEditor() {
  const wand = useWand();
  const dispatch = useAppDispatch();
  const config = useConfig();

  return (
    <StyledList>
      {fields.map(({ name, imgUrl, render }, index) => (
        <StyledListItem key={index} imgUrl={imgUrl}>
          <StyledName>{name}</StyledName>
          <StyledValue>{render(wand, dispatch, config)}</StyledValue>
        </StyledListItem>
      ))}
    </StyledList>
  );
}

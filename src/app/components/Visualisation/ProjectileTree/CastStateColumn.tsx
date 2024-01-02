import styled from 'styled-components';
import { GunActionState } from '../../../calc/actionState';
import {
  getNameForTrailMaterial,
  isTrailMaterial,
  TrailMaterial,
} from '../../../calc/materials';
import {
  isNotNullOrUndefined,
  isString,
  round,
  sign,
  tally,
} from '../../../util/util';
import { Config, useConfig } from '../../../redux/configSlice';
import { getBackgroundUrlForDamageType } from '../../../calc/damage';
import {
  FNSP,
  SIGN_MULTIPLY,
  SUFFIX_BILLION,
  SUFFIX_MILLION,
  SUFFIX_THOUSAND,
} from '../../../util';
import { TriggerCondition } from '../../../calc/trigger';
import { WithDebugHints } from '../../Debug';
import { Duration } from './Duration';
import { Unchanged, YesNo, YesOr } from '../../Presentation';

// TODO: handle extra_entities that affect damage/etc

const GridRowItem = styled.div<{
  $firstValue?: boolean;
  $firstInGroup?: boolean;
  $isTotal?: boolean;
}>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;

  height: 1em;
  line-height: 1.2em;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  white-space: nowrap;
  padding: 0.2em;

  ${({ $firstInGroup, $firstValue }) =>
    $firstInGroup
      ? $firstValue
        ? `
  border-top: 1px dotted var(--color-vis-cs-inborder);
    `
        : `
  border-top: 1px dotted var(--color-vis-cs-inborder-dark);
    `
      : ``}
  ${({ $isTotal }) =>
    $isTotal
      ? `
  border-left: 1px dotted var(--color-vis-cs-inborder);
  background-color: black;
  `
      : `
  border-left: 1px dotted var(--color-vis-cs-inborder-dark);
  `}
`;

const PropertyIcon = styled(GridRowItem)<{ $icon?: string }>`
  position: sticky;
  left: -10px;
  z-index: var(--zindex-stickyheader-shotgrid);
  background-position: center center;
  background-size: 1.1em;
  ${({ $icon }) => ($icon ? `${$icon}` : 'background-image: none;')};
  background-color: black;
`;

const PropertyName = styled(GridRowItem)`
  justify-content: end;
  padding-right: 0.3em;
  flex: 0 0 150px;
  background-color: black;
`;

const PropertyValue = styled(GridRowItem)`
  justify-content: center;
  padding-right: 0.4em;
  padding-left: 0.4em;
`;

const Warning = styled.span`
  color: var(--color-value-warning);
  background-color: red;
  &::before {
    content: '';
  }
`;

const LowerLimit = styled.span`
  &::after {
    content: '(Min)';
    line-height: 1;
    font-size: 0.83em;
    padding-left: 0.3em;
  }
`;

const UpperLimit = styled.span`
  &::after {
    content: '(Max)';
    line-height: 1;
    font-size: 0.83em;
    padding-left: 0.3em;
  }
`;

const Ignored = styled.span`
  color: var(--color-value-ignored);
  &::before {
    content: 'ignored';
  }
`;

const Numerator = styled.span`
  line-height: 0.7;
  font-size: 0.83em;
  vertical-align: top;
`;
const Denominator = styled.span`
  line-height: 1;
  font-size: 0.83em;
  vertical-align: bottom;
`;
const Fraction = styled(
  ({ a, b, className = '' }: { a: string; b: string; className?: string }) => {
    return (
      <span className={className}>
        <Numerator>{a}</Numerator>
        {'/'}
        <Denominator>{b}</Denominator>
      </span>
    );
  },
)`
  letter-spacing: -0.14em;
`;

const Adds = styled.span`
  &::before {
    content: '+';
    font-size: 0.9em;
  }
`;
const Exponent = styled.span`
  vertical-align: super;
  font-size: smaller;
  line-height: normal;
`;
const Mantissa = styled.span``;

const Scientific = ({
  number,
  precision = 2,
}: {
  number: number;
  precision?: number;
}) => {
  const [mantissa, exponent] = number.toExponential(2).split('e');
  return (
    <span>
      <Mantissa>{mantissa}</Mantissa>${SIGN_MULTIPLY}10
      <Exponent>{exponent}</Exponent>
    </span>
  );
};

const ReadableNumber = ({
  number: n,
  ifZero = <Unchanged />,
}: {
  number: number;
  ifZero?: JSX.Element;
}) => {
  if (n === 0) {
    return ifZero;
  }
  if (n < 0) {
    return <>{`${n}`}</>;
  }
  if (n < 1e3) {
    return <Adds>{`${n}`}</Adds>;
  }
  if (n < 1e6) {
    return <Adds>{`${Math.round(n / 1e1) / 100}${SUFFIX_THOUSAND}`}</Adds>;
  }
  if (n < 1e9) {
    return <Adds>{`${Math.round(n / 1e4) / 100}${SUFFIX_MILLION}`}</Adds>;
  }
  if (n < 1e12) {
    return <Adds>{`${Math.round(n / 1e7) / 100}${SUFFIX_BILLION}`}</Adds>;
  }
  return (
    <Adds>
      <Scientific number={n} />
    </Adds>
  );
};

const NotApplicable = styled(({ className }: { className?: string }) => (
  <Fraction className={className} a={'n'} b={'a'} />
))`
  color: var(--color-value-ignored);
  font-variant: small-caps;
`;
const Missing = styled.span`
  color: var(--color-value-ignored);
  &::before {
    content: '?';
  }
`;

const Infinite = styled.span`
  &::before {
    content: '∞';
    font-size: 1.2em;
  }
`;

// content: '${({ material }) => getNameForTrailMaterial(material)}:';
const MaterialTrail = styled.span<{
  $material: TrailMaterial;
}>`
  display: block;
  &::before {
    content: '';
    padding: 0.4em 1em 0 1em;
    background-position: 50% 50%;
    background-size: 1.4em;
    background-image: url('/data/trail/trail_${({ $material }) =>
      getNameForTrailMaterial($material)}.png');
    background-repeat: no-repeat;
    image-rendering: pixelated;
  }
`;

const Sign = ({ n, children }: React.PropsWithChildren & { n: number }) => (
  <>
    {`${n < 0 ? '' : '+'}`}
    {children ?? n}
  </>
);

const SignZero = ({
  n,
  ifZero = <Unchanged />,
}: {
  n: number;
  ifZero?: JSX.Element;
}) => (n === 0 ? ifZero : <Sign n={n} />);

const RadiusThresholdBonus = ({
  radius,
  ifZero = <Unchanged />,
  ifNaN = <NotApplicable />,
}: {
  radius: number;
  ifZero?: JSX.Element;
  ifNaN?: JSX.Element;
}): JSX.Element => {
  if (isNaN(radius)) return ifNaN;
  if (radius < 32) return <SignZero n={0} ifZero={ifZero} />;
  if (radius < 64) return <Sign n={325} />;
  if (radius < 128) return <Sign n={375} />;
  if (radius < 211) return <Sign n={500} />;
  return (
    <>
      <Sign n={600} />
      <Sign n={500} />
    </>
  );
};

type FileType = 'xml' | 'png' | 'text';
const FileTypeIconMap: Record<FileType, string> = {
  xml: `background-image: url('data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 384 512%22%3E%3C!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d=%22M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z%22%3E%3C/path%3E%3C/svg%3E');`,
  png: `background-image: url('data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 384 512%22%3E%3C!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d=%22M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z%22%3E%3C/path%3E%3C/svg%3E');`,
  text: `background-image: url('data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 384 512%22%3E%3C!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d=%22M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z%22%3E%3C/path%3E%3C/svg%3E');`,
} as const;

const FilePath = styled.span<{
  type: FileType;
}>`
  display: block;
  &::before {
    content: '';
    padding: 0 0.6em 0 0.7em;
    ${({ type }) => FileTypeIconMap[type]}
    background-position: 0 50%;
    background-size: 0.7em;
    background-repeat: no-repeat;
    image-rendering: pixelated;
  }
`;

type ExtendedActionState = GunActionState & {
  insideTrigger: boolean;
  isTotal: boolean;
  manaDrain?: number;
};

type FieldDescription = {
  hidden?: boolean;
  icon?: string;
  ignoredInTrigger?: boolean;
  noTotal?: boolean;
  key?: string;
  displayName: string;
  toolTip?: string;
  render: (
    actionState: ExtendedActionState,
    config: Config,
  ) => JSX.Element | string;
};

type FieldSection = {
  sectionIcon?: string;
  title: string;
  fields: FieldDescription[];
};

const fieldSections: FieldSection[] = [
  {
    title: 'Timing',
    fields: [
      {
        icon: `background-image: url('/data/wand/icon_mana_drain.png');`,
        key: 'action_mana_drain',
        displayName: 'Mana Drain',
        render: ({ manaDrain: v }) =>
          isNotNullOrUndefined(v) ? (
            `${round(Math.max(0, Number(v)), 0)} ${
              Number(v) < 0 ? `  (${sign(Number(v))})` : ``
            }`
          ) : (
            <Missing />
          ),
      },
      {
        icon: `background-image: url('/data/wand/icon_reload_time-s.png');`,
        key: 'reload_time',
        displayName: 'Recharge Time',
        render: ({ reload_time }) => <Duration unit={'f'} f={reload_time} />,
      },
      {
        icon: `background-image: url('/data/wand/icon_fire_rate_wait.png');`,
        key: 'fire_rate_wait',
        ignoredInTrigger: true,
        displayName: 'Cast Delay',
        render: ({ fire_rate_wait }) => (
          <Duration unit="f" f={fire_rate_wait} />
        ),
      },
      {
        icon: `background-image: url('/data/wand/icon_lifetime.png');`,
        key: 'lifetime_add',
        displayName: 'Lifetime',
        render: ({ lifetime_add, isTotal }) => {
          if (isTotal) {
            return (
              <Sign n={lifetime_add}>
                <Duration unit="f" f={lifetime_add} />
              </Sign>
            );
          }
          return lifetime_add === -1 ? <Infinite /> : <Unchanged></Unchanged>;
          // : `${lifetime}˷±~${lifetime_randomness}`;
        },
      },
      {
        hidden: true, // TODO
        icon: `background-image: url('/data/icons/lifetime_infinite.png');`,
        key: 'wisp_chance',
        noTotal: true,
        displayName: 'Wisp Chance',
        render: ({ isTotal /* lifetime, lifetime_randomness */ }) => {
          if (isTotal) {
            return <NotApplicable />;
          }
          return <Unchanged />;
          // return <Percentage>{wispChance(lifetime_randomness, lifetime)}</Percentage>
        },
      },
    ],
  },

  {
    title: 'Motion',
    fields: [
      {
        hidden: true, // TODO
        icon: `background-image: url('/data/wand/icon_spread_degrees.png');`,
        key: 'spread_degrees',
        displayName: 'Spread',
        render: ({ spread_degrees: v }) => (
          <SignZero n={Number(v)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `background-image: url('/data/icons/t_shape.png');`,
        key: 'pattern_degrees',
        displayName: 'Pattern Angle', // ⊾
        render: ({ pattern_degrees: v }) => `${round(Number(v), 1)}°`,
      },
      {
        hidden: true, // TODO
        icon: `background-image: url('/data/wand/icon_bounces.png');`,
        key: 'bounces',
        displayName: 'Bounces',
        render: ({ bounces: v }) => (
          <SignZero n={Number(v)} ifZero={<Unchanged />} />
        ),
      },
      {
        hidden: true, // TODO
        key: 'gravity',
        displayName: 'Gravity',
        render: ({ gravity: v }) => <SignZero n={Number(v)} />,
      },
      {
        icon: `background-image: url('/data/wand/icon_speed_multiplier.png');`,
        key: 'speed_multiplier1',
        displayName: 'Speed',
        toolTip: 'Initial speed of the projectile.',
        render: ({ speed_multiplier: v }) => {
          const n = Number(v);
          if (n < 0) {
            return `<0 ?!`;
          }
          if (n === 0) {
            return `0`;
          }
          if (n === 1) {
            return <Unchanged />;
          }
          if (n < 1.17549e-38) {
            return <Warning>{`${SIGN_MULTIPLY}0 (underflow)`}</Warning>;
          }
          if (n < 0.0001) {
            return (
              <LowerLimit>{`${SIGN_MULTIPLY}${n.toExponential(2)}`}</LowerLimit>
            );
          }
          if (n < 1) {
            return `${SIGN_MULTIPLY}${n.toPrecision(2)}`;
          }
          if (n === 20) {
            return <UpperLimit>{`${SIGN_MULTIPLY}20`}</UpperLimit>;
          }
          if (n > 1) {
            return `${SIGN_MULTIPLY}${n.toFixed(2)}`;
          }
          return `${SIGN_MULTIPLY}${n.toPrecision(2)}`;
        },
      },
      {
        // TODO - needs extended spell info
        icon: `background-image: url('/data/wand/icon_speed_multiplier.png');`,
        key: 'speed_multiplier2',
        displayName: 'Speed Bonus',
        toolTip: 'Speed Scaled Damage Multiplier',
        render: ({ speed_multiplier: v }) => {
          return <NotApplicable />;
          // const n = Number(v);
          // if (n === 1) {
          //   return <Unchanged />;
          // }
          // if (n < 1.17549e-38) {
          //   return <Warning>{`${SIGN_MULTIPLY}0 (underflow)`}</Warning>;
          // }
          // if (n < 1) {
          //   return `${SIGN_MULTIPLY}${n}`;
          // }
          // if (n > 20) {
          //   return `${SIGN_MULTIPLY}20 (capped)`;
          // }
          // if (n > 1) {
          // }
          // return `${SIGN_MULTIPLY}${n}`;
        },
      },
    ],
  },

  {
    title: 'Crit',
    fields: [
      {
        icon: `background-image: url('/data/status/wet.png');`,
        key: 'crit_on_wet',
        displayName: 'Crit On: Wet',
        noTotal: true,
        render: ({ game_effect_entities: v }) => (
          <YesOr yes={v.includes('effect_apply_wet')}>
            <Unchanged />
          </YesOr>
        ),
      },
      {
        icon: `background-image: url('/data/status/oiled.png');`,
        key: 'crit_on_oil',
        displayName: 'Crit On: Oil',
        noTotal: true,
        render: ({ game_effect_entities: v }) => (
          <YesOr yes={v.includes('effect_apply_oiled')}>
            <Unchanged />
          </YesOr>
        ),
      },
      {
        icon: `background-image: url('/data/status/bloody.png');`,
        key: 'crit_on_blood',
        displayName: 'Crit On: Blood',
        noTotal: true,
        render: ({ game_effect_entities: v }) => (
          <YesOr yes={v.includes('effect_apply_bloody')}>
            <Unchanged />
          </YesOr>
        ),
      },
      {
        icon: `background-image: url('/data/status/burning.png');`,
        key: 'crit_on_fire',
        displayName: 'Crit On: Fire',
        render: ({ game_effect_entities: v, isTotal }) =>
          isTotal ? (
            <YesNo
              yes={v.includes('effect_apply_on_fire')}
              customNo={<Unchanged content={'No'} />}
            />
          ) : (
            <YesNo yes={false} customNo={<Unchanged />} />
          ),
      },
      {
        icon: `background-image: url('/data/wand/icon_damage_critical_chance.png');`,
        key: 'damage_critical_chance',
        displayName: 'Crit Chance',
        render: ({ damage_critical_chance: v }) => `${Number(v)}%`,
      },
      {
        key: 'damage_critical_multiplier',
        displayName: 'Crit Mult.',
        toolTip: 'Critical Hit Damage Multiplier',
        render: ({ damage_critical_multiplier: v }) => {
          return `${v}`;
        },
      },
    ],
  },
  {
    title: 'Damage',
    fields: [
      {
        icon: `background-image: url('/data/warnings/icon_danger.png');`,
        key: 'friendly_fire',
        displayName: 'Friendly Fire',
        render: ({ friendly_fire: v, isTotal }) => (
          <YesNo
            yes={Boolean(v)}
            warnIf={'yes'}
            customMaybe={<Unchanged content={'No'} />}
          />
        ),
      },
      {
        icon: `background-image: url('/data/ui_gfx/gun_actions/zero_damage.png');`,
        key: 'damage_null_all',
        displayName: 'All Null',
        render: ({ damage_null_all: v }) => (
          <YesNo yes={Boolean(v)} customNo={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('melee'),
        key: 'damage_melee_add',
        displayName: 'Melee',
        render: ({ damage_melee_add: v }) => (
          <ReadableNumber
            number={round(Number(v) * 25, 1)}
            ifZero={<Unchanged />}
          />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('projectile'),
        key: 'damage_projectile_add',
        displayName: 'Projectile',
        render: ({ damage_projectile_add: v }) => (
          <ReadableNumber
            number={round(Number(v) * 25, 1)}
            ifZero={<Unchanged />}
          />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('electricity'),
        key: 'damage_electricity_add',
        displayName: 'Electric',
        render: ({ damage_electricity_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('fire'),
        key: 'damage_fire_add',
        displayName: 'Fire',
        render: ({ damage_fire_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('ice'),
        key: 'damage_ice_add',
        displayName: 'Ice',
        render: ({ damage_ice_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('slice'),
        key: 'damage_slice_add',
        displayName: 'Slice',
        render: ({ damage_slice_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('heal'),
        key: 'damage_healing_add',
        displayName: 'Healing',
        render: ({ damage_healing_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('curse'),
        key: 'damage_curse_add',
        displayName: 'Curse',
        render: ({ damage_curse_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('holy'),
        key: 'damage_holy_add',
        displayName: 'Holy',
        render: ({ damage_holy_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('drill'),
        key: 'damage_drill_add',
        displayName: 'Drill',
        render: ({ damage_drill_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: getBackgroundUrlForDamageType('explosion'),
        key: 'damage_explosion_add',
        displayName: 'Explosion',
        render: ({ damage_explosion_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `background-image: url('/data/wand/icon_explosion_radius.png');`,
        key: 'explosion_radius',
        displayName: 'Expl. Radius',
        render: ({ explosion_radius: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        key: 'explosion_radius_bonus',
        displayName: 'Expl. Threshold',
        render: ({ explosion_radius: v }) => (
          <RadiusThresholdBonus radius={Number(v)} ifZero={<Unchanged />} />
        ),
      },
    ],
  },
  {
    title: 'Impact',
    fields: [
      {
        icon: `background-image: url('/data/wand/icon_recoil.png');`,
        key: 'recoil',
        displayName: 'Recoil',
        render: ({ recoil: v }) => {
          const n = Number(v);
          return `${Math.max(0, n)} ${n < 0 ? `  (${sign(n)})` : ``}`;
        },
      },
      {
        icon: `background-image: url('/data/wand/icon_knockback.png');`,
        key: 'knockback_force',
        displayName: 'Knockback',
        render: ({ knockback_force: v }) => <>{`${v}`}</>,
      },
      {
        key: 'screenshake',
        displayName: 'Screen Shake',
        render: ({ screenshake: v }) => <>{`${v}`}</>,
      },
      // {
      //   key: 'physics_impulse_coeff',
      //   displayName: 'Phys. Imp. Coeff.',
      //   render: ({ physics_impulse_coeff: v }) => <>{`${v}`}</>,
      // },
      // {
      //   key: 'lightning_count',
      //   displayName: 'Lightning Count',
      //   render: ({ lightning_count: v }) => <>{`${v}`}</>,
      // },
    ],
  },

  {
    title: 'Material',
    fields: [
      // {
      //   key: 'material',
      //   displayName: 'Material',
      //   render: ({ material: v }) => <>{`${v}`}</>,
      // },
      // {
      //   key: 'material_amount',
      //   displayName: 'Material Amount',
      //   render: ({ material_amount: v }) => <>{`${v}`}</>,
      // },

      /* TODO + memoise */
      {
        icon: `background-image: url('/data/trail/trail_oil.png');`,
        key: 'trail_material_oil',
        displayName: 'Oil Trail',
        render: ({ trail_material: v, isTotal }) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) =>
                  isTrailMaterial(name) && name === 'oil' ? (
                    <MaterialTrail $material={name} key={name}>
                      {isTotal && `${SIGN_MULTIPLY}${FNSP}${count}`}
                    </MaterialTrail>
                  ) : null,
              )}
            </>
          ) : (
            <>{`${v}`}</>
          ),
      },
      {
        icon: `background-image: url('/data/trail/trail_water.png');`,
        key: 'trail_material_water',
        displayName: 'Water Trail',
        render: ({ trail_material: v, isTotal }) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) =>
                  isTrailMaterial(name) && name === 'water' ? (
                    <MaterialTrail $material={name} key={name}>
                      {isTotal && `${SIGN_MULTIPLY}${FNSP}${count}`}
                    </MaterialTrail>
                  ) : null,
              )}
            </>
          ) : (
            <>{`${v}`}</>
          ),
      },
      {
        icon: `background-image: url('/data/trail/trail_acid.png');`,
        key: 'trail_material_acid',
        displayName: 'Acid Trail',
        render: ({ trail_material: v, isTotal }) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) =>
                  isTrailMaterial(name) && name === 'acid' ? (
                    <MaterialTrail $material={name} key={name}>
                      {isTotal && `${SIGN_MULTIPLY}${FNSP}${count}`}
                    </MaterialTrail>
                  ) : null,
              )}
            </>
          ) : (
            <>{`${v}`}</>
          ),
      },
      {
        icon: `background-image: url('/data/trail/trail_posion.png');`,
        key: 'trail_material_poison',
        displayName: 'Poison Trail',
        render: ({ trail_material: v, isTotal }) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) =>
                  isTrailMaterial(name) && name === 'poison' ? (
                    <MaterialTrail $material={name} key={name}>
                      {isTotal && `${SIGN_MULTIPLY}${FNSP}${count}`}
                    </MaterialTrail>
                  ) : null,
              )}
            </>
          ) : (
            <>{`${v}`}</>
          ),
      },
      {
        icon: `background-image: url('/data/trail/trail_Fire.png');`,
        key: 'trail_material_fire',
        displayName: 'Fire Trail',
        render: ({ trail_material: v, isTotal }) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) =>
                  isTrailMaterial(name) && name === 'fire' ? (
                    <MaterialTrail $material={name} key={name}>
                      {isTotal && `${SIGN_MULTIPLY}${FNSP}${count}`}
                    </MaterialTrail>
                  ) : null,
              )}
            </>
          ) : (
            <>{`${v}`}</>
          ),
      },
      {
        key: 'trail_material_amount',
        displayName: 'Trail Volume',
        render: ({ trail_material_amount: v }) => <>{`${v}`}</>,
      },
    ],
  },
];

export const FieldNamesColumn = styled(
  ({ castState }: { castState?: GunActionState }) => {
    return (
      <>
        {castState &&
          fieldSections.map(({ fields }, i1) =>
            fields.map(({ key, displayName }, i2) => (
              <PropertyName
                key={key ?? `${i1}-${i2}-${key}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
              >
                {displayName}
              </PropertyName>
            )),
          )}
      </>
    );
  },
)`
  ${WithDebugHints} && {
    background-color: #a0a;
  }
`;

export const IconsColumn = styled(
  ({ castState }: { castState?: GunActionState }) => {
    return (
      <>
        {castState &&
          fieldSections.map(({ fields }, i1) =>
            fields.map(({ key, icon }, i2) => (
              <PropertyIcon
                key={key ?? `${i1}-${i2}-${key}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
                $icon={icon ?? ''}
              />
            )),
          )}
      </>
    );
  },
)`
  ${WithDebugHints} && {
    background-color: #0aa;
  }
`;

export const TotalsColumn = styled(
  ({
    castState,
    manaDrain,
    insideTrigger = false,
    triggerType,
  }: {
    castState?: GunActionState;
    manaDrain?: number;
    insideTrigger?: boolean;
    triggerType?: TriggerCondition;
    showValues?: boolean;
  }) => {
    const config = useConfig();
    const { castShowChanged } = config;

    return (
      <>
        {castState &&
          fieldSections.map(({ fields }, i1) =>
            fields.map(
              (
                { key, render, ignoredInTrigger = false, noTotal = false },
                i2,
              ) => (
                <PropertyValue
                  key={key ?? `${i1}-${i2}`}
                  $firstValue={i1 === 0}
                  $firstInGroup={i2 === 0}
                  $isTotal={true}
                >
                  {insideTrigger && ignoredInTrigger ? (
                    <Ignored />
                  ) : noTotal ? (
                    <Unchanged />
                  ) : (
                    render(
                      {
                        ...castState,
                        insideTrigger,
                        isTotal: true,
                        manaDrain,
                      },
                      config,
                    )
                  )}
                </PropertyValue>
              ),
            ),
          )}
      </>
    );
  },
)`
  ${WithDebugHints} && {
    background-color: #00a;
  }
`;

export const ProjectileColumn = styled(
  ({
    castState,
    manaDrain,
    insideTrigger = false,
    triggerType,
  }: {
    castState?: GunActionState;
    manaDrain?: number;
    insideTrigger?: boolean;
    triggerType?: TriggerCondition;
  }) => {
    const config = useConfig();
    const { castShowChanged } = config;

    return (
      <>
        {castState &&
          fieldSections.map(({ fields }, i1) =>
            fields.map(({ key, render, ignoredInTrigger = false }, i2) => (
              <PropertyValue
                key={key ?? `${i1}-${i2}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
                $isTotal={false}
              >
                {!insideTrigger || !ignoredInTrigger ? (
                  render(
                    {
                      ...castState,
                      isTotal: false,
                      insideTrigger,
                      manaDrain,
                    },
                    config,
                  )
                ) : (
                  <Ignored />
                )}
              </PropertyValue>
            )),
          )}
      </>
    );
  },
)`
  ${WithDebugHints} && {
    background-color: #0a0;
  }
`;

export const SubTotalsColumn = styled(TotalsColumn)`
  ${WithDebugHints} && {
    background-color: #a00;
  }
`;

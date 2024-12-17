import type { SpriteName } from '../../../calc/sprite';
import {
  FNSP,
  SIGN_MULTIPLY,
  SUFFIX_BILLION,
  SUFFIX_MILLION,
  SUFFIX_THOUSAND,
  isNotNullOrUndefined,
  isString,
  round,
  sign,
  tally,
} from '../../../util';
import { Duration } from '../Duration';
import { Unchanged, YesNo, YesOr } from '../../Presentation';
import type { GunActionState } from '../../../calc/actionState';
import styled from 'styled-components';
import type { TrailMaterial } from '../../../calc/materials';
import {
  getNameForTrailMaterial,
  isTrailMaterial,
} from '../../../calc/materials';
import type { Config } from '../../../redux/configSlice';

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

const Warning = styled.span`
  color: var(--color-value-warning);
  background-color: red;
  &::before {
    content: '';
  }
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
const _Underflow = ({ className = '' }: { className?: string }) => {
  return <Warning className={className}>U</Warning>;
};
const Underflow = styled(_Underflow)`
  display: inline-flex;
  align-self: end;
  align-items: center;
  justify-content: center;
  margin-left: 0.2em;
  border-radius: 50%;
  padding: 0.06em;
  font-size: 0.8em;
  height: 1.4em;
  width: 1.4em;
  --a: -1px;
  --b: 1px;
  text-shadow: var(--a) var(--a) 0 black, var(--b) var(--b) 0 black,
    var(--a) var(--b) 0 black, var(--b) var(--a) 0 black, 0 var(--a) 0 black,
    0 var(--b) 0 black, var(--a) 0 0 black, var(--b) 0 0 black;
  filter: drop-shadow(0 0 1px #ff2c2c);
  border: 0.16em dashed #811e1e;
  box-sizing: border-box;
  padding-top: 0.24em;
  background-color: #cb1414;
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

type ExtendedActionState = GunActionState & {
  insideTrigger: boolean;
  isTotal: boolean;
  manaDrain?: number;
};

type FieldDescription = {
  hidden?: boolean;
  icon?: SpriteName;
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

export const shotTableGridRows = () =>
  shotTableSections
    .map(
      ({ title, fields }) =>
        `[${title.toLowerCase()}] repeat(${fields.length}, min-content)`,
    )
    .join(' ');

export const shotTableSections: FieldSection[] = [
  {
    title: 'Timing',
    fields: [
      {
        icon: `icon.manadrain`,
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
        icon: `icon.reloadtime`,
        key: 'reload_time',
        displayName: 'Recharge Time',
        render: ({ reload_time }) => <Duration unit={'f'} f={reload_time} />,
      },
      {
        icon: `icon.castdelay`,
        key: 'fire_rate_wait',
        ignoredInTrigger: true,
        displayName: 'Cast Delay',
        render: ({ fire_rate_wait }) => (
          <Duration unit="f" f={fire_rate_wait} />
        ),
      },
      {
        icon: `icon.lifetime`,
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
        icon: `icon.lifetime.infinite`,
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
        icon: `icon.spread`,
        key: 'spread_degrees',
        displayName: 'Spread',
        render: ({ spread_degrees: v }) => (
          <SignZero n={Number(v)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.tshape`,
        key: 'pattern_degrees',
        displayName: 'Pattern Angle', // ⊾
        render: ({ pattern_degrees: v }) => `${round(Number(v), 1)}°`,
      },
      {
        hidden: true, // TODO
        icon: `icon.bounces`,
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
        icon: `icon.speed.base`,
        key: 'speed_base',
        displayName: 'Base Speed',
        toolTip: 'The configured initial speed of this projectile',
        render: ({ speed_multiplier: v }) => {
          return <NotApplicable />;
        },
      },
      {
        icon: `icon.speed.multi`,
        key: 'speed_multiplier1',
        displayName: 'Speed Multiplier',
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
            return (
              <>
                {`${SIGN_MULTIPLY}0`}
                <Underflow />
              </>
            );
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
        icon: `icon.speed.initial`,
        key: 'speed_initial',
        displayName: 'Initial Speed',
        toolTip:
          'The initial speed of this projectile given the speed multiplier',
        render: ({ speed_multiplier: v }) => {
          return <NotApplicable />;
        },
      },
      {
        // TODO - needs extended spell info
        icon: `icon.speed.bonus`,
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
        icon: `icon.stain.wet`,
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
        icon: `icon.stain.oiled`,
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
        icon: `icon.stain.bloody`,
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
        icon: `icon.stain.burning`,
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
        icon: `icon.critchance`,
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
        icon: `icon.danger`,
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
        icon: `icon.zerodamage`,
        key: 'damage_null_all',
        displayName: 'All Null',
        render: ({ damage_null_all: v }) => (
          <YesNo yes={Boolean(v)} customNo={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.melee`,
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
        icon: `icon.damage.projectile`,
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
        icon: `icon.damage.electricity`,
        key: 'damage_electricity_add',
        displayName: 'Electric',
        render: ({ damage_electricity_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.fire`,
        key: 'damage_fire_add',
        displayName: 'Fire',
        render: ({ damage_fire_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.ice`,
        key: 'damage_ice_add',
        displayName: 'Ice',
        render: ({ damage_ice_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.slice`,
        key: 'damage_slice_add',
        displayName: 'Slice',
        render: ({ damage_slice_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.heal`,
        key: 'damage_healing_add',
        displayName: 'Healing',
        render: ({ damage_healing_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.curse`,
        key: 'damage_curse_add',
        displayName: 'Curse',
        render: ({ damage_curse_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.holy`,
        key: 'damage_holy_add',
        displayName: 'Holy',
        render: ({ damage_holy_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.drill`,
        key: 'damage_drill_add',
        displayName: 'Drill',
        render: ({ damage_drill_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.damage.explosion`,
        key: 'damage_explosion_add',
        displayName: 'Explosion',
        render: ({ damage_explosion_add: v }) => (
          <SignZero n={round(Number(v) * 25, 0)} ifZero={<Unchanged />} />
        ),
      },
      {
        icon: `icon.explosionradius`,
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
        icon: `icon.recoil`,
        key: 'recoil',
        displayName: 'Recoil',
        render: ({ recoil: v }) => {
          const n = Number(v);
          return `${Math.max(0, n)} ${n < 0 ? `  (${sign(n)})` : ``}`;
        },
      },
      {
        icon: `icon.knockback`,
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
        icon: `icon.trail.oil`,
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
        icon: `icon.trail.water`,
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
        icon: `icon.trail.acid`,
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
        icon: `icon.trail.poison`,
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
        icon: `icon.trail.fire`,
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

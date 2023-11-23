import styled from 'styled-components/macro';
import {
  defaultGunActionState,
  GunActionState,
} from '../../../calc/actionState';
import {
  getNameForTrailMaterial,
  isTrailMaterial,
  TrailMaterial,
} from '../../../calc/materials';
import {
  formatYesNo,
  isString,
  radiusThresholdBonus,
  round,
  sign,
  signZero,
  tally,
  toSeconds,
} from '../../../util/util';
import { Config, useConfig } from '../../../redux/configSlice';
import { getBackgroundUrlForDamageType } from '../../../calc/damage';
import { SIGN_MULTIPLY } from '../../../util';

const PropertyIcon = styled.div<{ icon?: string }>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;

  height: 1em;
  padding: 0.2em 1em 0.2em 1.8em;

  background-position: 0em 0em;
  background-size: 1.1em;
  ${({ icon }) => (icon ? `${icon}` : 'background-image: none;')};
  background-repeat: no-repeat;
  image-rendering: pixelated;
`;

const PropertyName = styled.div`
  text-align: right;
  line-height: 1.2em;
  padding-right: 0.3em;
  flex: 0 0 150px;
  white-space: nowrap;
`;

const PropertyValue = styled.div`
  text-align: center;
  flex: 0 0 auto;
`;

const Warning = styled.span`
  color: var(--color-value-warning);
  border: 3px dashed red;
  background-color: red;
  &::before {
    content: '';
  }
`;

const Unchanged = styled.span`
  color: var(--color-value-ignored);
  &::before {
    content: '--';
  }
`;

type MaterialTrailProps = {
  material: TrailMaterial;
};
const MaterialTrail = styled.span.attrs(({ material }: MaterialTrailProps) => ({
  name: getNameForTrailMaterial(material),
}))<MaterialTrailProps>`
  display: block;
  &::after {
    content: '${({ material }) => material}:';
    content: '';
    padding: 0.4em 1em 0 1em;
    background-position: 50% 50%;
    background-size: 1.4em;
    background-image: url('/data/trail/trail_${({ material }) =>
      material}.png');
    background-repeat: no-repeat;
    image-rendering: pixelated;
  }
`;

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

const formatDuration = (v: number, asSeconds: boolean) => {
  const n = Number(v);
  if (asSeconds) {
    const s = toSeconds(n);
    return `${round(Math.max(0, s), 2)} s${n < 0 ? `  (${sign(s)} s)` : ``}`;
  } else {
    return `${round(Math.max(0, n), 0)} fr${n < 0 ? `  (${sign(n)} fr)` : ``}`;
  }
};

type ExtendedActionState = GunActionState & {
  manaDrain?: number;
};

type FieldDescription = {
  icon?: string;
  field: keyof GunActionState;
  ignoredInTrigger?: boolean;
  noTotal?: boolean;
  key?: string;
  displayName: string;
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

/* signZero(round(Number(v), 1), <Unchanged />), */
const fieldSections: FieldSection[] = [
  {
    title: 'Timing',
    fields: [
      {
        icon: `background-image: url('/data/wand/icon_mana_drain.png');`,
        field: 'action_mana_drain',
        displayName: 'Mana Drain',
        render: ({ manaDrain: v }) =>
          `${round(Math.max(0, Number(v)), 0)} ${
            Number(v) < 0 ? `  (${sign(Number(v))})` : ``
          }`,
      },
      {
        icon: `background-image: url('/data/wand/icon_reload_time-s.png');`,
        field: 'reload_time',
        displayName: 'Recharge Time',
        render: ({ reload_time }, { showDurationsInFrames }) =>
          formatDuration(reload_time, showDurationsInFrames),
      },
      {
        icon: `background-image: url('/data/wand/icon_fire_rate_wait.png');`,
        field: 'fire_rate_wait',
        ignoredInTrigger: true,
        displayName: 'Cast Delay',
        render: ({ fire_rate_wait }, { showDurationsInFrames }) =>
          formatDuration(fire_rate_wait, showDurationsInFrames),
      },
      {
        icon: `background-image: url('/data/wand/icon_lifetime.png');`,
        field: 'lifetime_add',
        displayName: 'Lifetime',
        render: ({ lifetime_add }, { showDurationsInFrames }) =>
          formatDuration(lifetime_add, showDurationsInFrames),
      },
      {
        icon: `background-image: url('/data/icons/lifetime_infinite.png');`,
        field: 'lifetime_add',
        noTotal: true,
        displayName: 'Wisp Chance',
        render: ({ lifetime_add }, {}) => '6.67%',
      },
    ],
  },

  {
    title: 'Motion',
    fields: [
      {
        icon: `background-image: url('/data/wand/icon_spread_degrees.png');`,
        field: 'spread_degrees',
        displayName: 'Spread',
        render: ({ spread_degrees: v }) =>
          signZero(round(Number(v), 0), <Unchanged />),
      },
      {
        icon: `background-image: url('/data/icons/t_shape.png');`,
        field: 'pattern_degrees',
        displayName: 'Pattern Angle',
        render: ({ pattern_degrees: v }) => `${round(Number(v), 1)}⊾°`,
      },
      {
        icon: `background-image: url('/data/wand/icon_bounces.png');`,
        field: 'bounces',
        displayName: 'Bounces',
        render: ({ bounces: v }) => signZero(Number(v), <Unchanged />),
      },
      // {
      //   field: 'gravity',
      //   displayName: 'Gravity',
      //   render: ({ gravity: v }) => `${signZero(Number(v))}`,
      // },
      {
        icon: `background-image: url('/data/wand/icon_speed_multiplier.png');`,
        field: 'speed_multiplier',
        displayName: 'Speed',
        render: ({ speed_multiplier: v }) =>
          Number(v) !== 1 ? `${SIGN_MULTIPLY} ${v}` : <Unchanged />,
      },
    ],
  },

  {
    title: 'Crit',
    fields: [
      {
        icon: `background-image: url('/data/wand/icon_damage_critical_chance.png');`,
        field: 'damage_critical_chance',
        displayName: 'Crit Chance',
        render: ({ damage_critical_chance: v }) => `${sign(Number(v))}%`,
      },
      {
        field: 'damage_critical_multiplier',
        displayName: 'Crit Multiplier',
        render: ({ damage_critical_multiplier: v }) => `${v}`,
      },
    ],
  },
  {
    title: 'Damage',
    fields: [
      {
        icon: `background-image: url('/data/warnings/icon_danger.png');`,
        field: 'friendly_fire',
        displayName: 'Friendly Fire',
        render: ({ friendly_fire: v }) =>
          formatYesNo(Boolean(v), { ifTrue: <Warning>{'Yes'}</Warning> }),
      },
      {
        icon: `background-image: url('/data/ui_gfx/gun_actions/zero_damage.png');`,
        field: 'damage_null_all',
        displayName: 'All Null',
        render: ({ damage_null_all: v }) => formatYesNo(Boolean(v)),
      },

      {
        icon: getBackgroundUrlForDamageType('melee'),
        field: 'damage_melee_add',
        displayName: 'Melee',
        render: ({ damage_melee_add: v }) =>
          signZero(round(Number(v) * 25, 1), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('projectile'),
        field: 'damage_projectile_add',
        displayName: 'Projectile',
        render: ({ damage_projectile_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('electricity'),
        field: 'damage_electricity_add',
        displayName: 'Electric',
        render: ({ damage_electricity_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('fire'),
        field: 'damage_fire_add',
        displayName: 'Fire',
        render: ({ damage_fire_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('ice'),
        field: 'damage_ice_add',
        displayName: 'Ice',
        render: ({ damage_ice_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('slice'),
        field: 'damage_slice_add',
        displayName: 'Slice',
        render: ({ damage_slice_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('heal'),
        field: 'damage_healing_add',
        displayName: 'Healing',
        render: ({ damage_healing_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('curse'),
        field: 'damage_curse_add',
        displayName: 'Curse',
        render: ({ damage_curse_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('holy'),
        field: 'damage_holy_add',
        displayName: 'Holy',
        render: ({ damage_holy_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('drill'),
        field: 'damage_drill_add',
        displayName: 'Drill',
        render: ({ damage_drill_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: getBackgroundUrlForDamageType('explosion'),
        field: 'damage_explosion_add',
        displayName: 'Explosion',
        render: ({ damage_explosion_add: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        icon: `background-image: url('/data/wand/icon_explosion_radius.png');`,
        field: 'explosion_radius',
        displayName: 'Expl. Radius',
        render: ({ explosion_radius: v }) =>
          signZero(round(Number(v) * 25, 0), <Unchanged />),
      },
      {
        key: 'explosion_radius_threshold',
        field: 'explosion_radius',
        displayName: 'Expl. Threshold',
        render: ({ explosion_radius: v }) =>
          radiusThresholdBonus(Number(v), <Unchanged />),
      },
    ],
  },
  {
    title: 'Impact',
    fields: [
      {
        icon: `background-image: url('/data/wand/icon_recoil.png');`,
        field: 'recoil',
        displayName: 'Recoil',
        render: ({ recoil: v }) => {
          const n = Number(v);
          return `${Math.max(0, n)} ${n < 0 ? `  (${sign(n)})` : ``}`;
        },
      },
      {
        icon: `background-image: url('/data/wand/icon_knockback.png');`,
        field: 'knockback_force',
        displayName: 'Knockback',
        render: ({ knockback_force: v }) => `${v}`,
      },
      {
        field: 'screenshake',
        displayName: 'Screen Shake',
        render: ({ screenshake: v }) => `${v}`,
      },
      {
        field: 'physics_impulse_coeff',
        displayName: 'Phys. Imp. Coeff.',
        render: ({ physics_impulse_coeff: v }) => `${v}`,
      },
      {
        field: 'lightning_count',
        displayName: 'Lightning Count',
        render: ({ lightning_count: v }) => `${v}`,
      },
    ],
  },

  {
    title: 'Material',
    fields: [
      // {
      //   field: 'material',
      //   displayName: 'Material',
      //   render: ({ material: v }) => `${v}`,
      // },
      // {
      //   field: 'material_amount',
      //   displayName: 'Material Amount',
      //   render: ({ material_amount: v }) => `${v}`,
      // },
      {
        field: 'trail_material',
        displayName: 'Trails:',
        render: ({ trail_material: v }) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) =>
                  isTrailMaterial(name) ? (
                    <MaterialTrail material={name} key={name}>
                      {`${SIGN_MULTIPLY} ${count}`}
                    </MaterialTrail>
                  ) : null,
              )}
            </>
          ) : (
            `${v}`
          ),
      },
      {
        field: 'trail_material_amount',
        displayName: 'Trail Volume',
        render: ({ trail_material_amount: v }) => `${v}`,
      },
    ],
  },
];

// todo: handle extra_entities that affect damage/etc

export const CastStateNamesColumn = ({
  castState,
}: {
  castState?: GunActionState;
}) => {
  return (
    <>
      {castState &&
        fieldSections.map(({ fields }) => (
          <>
            {fields.map(({ displayName }) => (
              <PropertyName>{displayName}</PropertyName>
            ))}
          </>
        ))}
    </>
  );
};

export const CastStateIconsColumn = ({
  castState,
}: {
  castState?: GunActionState;
}) => {
  return (
    <>
      {castState &&
        fieldSections.map(({ fields }) => (
          <>
            {fields.map(({ field, key, icon, displayName }) => (
              <PropertyIcon key={key ?? field} icon={icon ?? ''} />
            ))}
          </>
        ))}
    </>
  );
};

export const CastStateTotalsColumn = ({
  castState,
  manaDrain,
  insideTrigger = false,
}: {
  castState?: GunActionState;
  manaDrain?: number;
  insideTrigger?: boolean;
  showValues?: boolean;
}) => {
  const config = useConfig();
  const { castShowChanged } = config;

  return (
    <>
      {castState &&
        fieldSections.map(({ fields }) => (
          <>
            {fields.map(({ render, ignoredInTrigger = false }) => {
              return (
                <>
                  <PropertyValue>
                    {!insideTrigger || !ignoredInTrigger
                      ? render({ ...castState, manaDrain }, config)
                      : 'ignored'}
                  </PropertyValue>
                </>
              );
            })}
          </>
        ))}
    </>
  );
};

export const CastStateProjectileColumn = ({
  castState,
  manaDrain,
  insideTrigger = false,
}: {
  castState?: GunActionState;
  manaDrain?: number;
  insideTrigger?: boolean;
}) => {
  const config = useConfig();
  const { castShowChanged } = config;

  return (
    <>
      {castState &&
        fieldSections.map(({ fields }) => (
          <>
            {fields.map(({ render, ignoredInTrigger = false }) => {
              return (
                <>
                  <PropertyValue>
                    {!insideTrigger || !ignoredInTrigger
                      ? render({ ...castState, manaDrain }, config)
                      : 'ignored'}
                  </PropertyValue>
                </>
              );
            })}
          </>
        ))}
    </>
  );
};

export const CastStateSubTotalsColumn = CastStateTotalsColumn;

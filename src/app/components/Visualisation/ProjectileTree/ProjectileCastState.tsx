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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: #fff;
  font-weight: unset;
  font-size: 0.8em;
  min-width: 230px;
  border: 1px solid black;
  padding: 1px;
`;

const StyledListItem = styled.div<{ icon?: string }>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;

  padding: 0.2em 1em 0.2em 1.8em;
  background-position: 0.2em 50%;
  background-size: 1.4em;
  ${({ icon }) => (icon ? `${icon}` : 'background-image: none;')};
  background-repeat: no-repeat;
  image-rendering: pixelated;
`;

const StyledName = styled.span`
  text-align: left;
  flex: 0 0 150px;
`;

const StyledValue = styled.span`
  text-align: left;
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

const ListTitle = styled.div<{ icon?: string }>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  font-size: 0.7em;
  font-variant: small-caps;
  padding: 0.3em 1.8em 0.1em 0.4em;
  background-position: 0.24em 50%;
  border-left: 0.6em solid white;
  border-bottom: 1px solid white;
  align-self: stretch;
  margin-bottom: 0.1em;
  background-position: 0.24em 50%;
  background-size: 1.2em;
  ${({ icon }) => (icon ? `${icon};` : 'none;')};
  background-repeat: no-repeat;
  image-rendering: pixelated;
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

type ExtendedActionState = GunActionState & {
  manaDrain?: number;
};

type FieldDescription = {
  icon?: string;
  field: keyof GunActionState;
  ignoredInTrigger?: boolean;
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
        render: ({ reload_time: v }, { showDurationsInFrames }) => {
          const n = Number(v);
          if (showDurationsInFrames) {
            return `${round(Math.max(0, n), 0)} fr${
              n < 0 ? `  (${sign(n)} fr)` : ``
            }`;
          } else {
            const s = toSeconds(n);
            return `${round(Math.max(0, s), 2)} s${
              n < 0 ? `  (${sign(s)} s)` : ``
            }`;
          }
        },
      },
      {
        icon: `background-image: url('/data/wand/icon_fire_rate_wait.png');`,
        field: 'fire_rate_wait',
        ignoredInTrigger: true,
        displayName: 'Cast Delay',
        render: ({ fire_rate_wait: v }, { showDurationsInFrames }) => {
          const n = Number(v);
          if (showDurationsInFrames) {
            return `${round(Math.max(0, n), 0)} fr${
              n < 0 ? `  (${sign(n)} fr)` : ``
            }`;
          } else {
            const s = toSeconds(n);
            return `${round(Math.max(0, s), 2)} s${
              n < 0 ? `  (${sign(s)} s)` : ``
            }`;
          }
        },
      },
      {
        field: 'lifetime_add',
        displayName: 'Lifetime',
        render: ({ lifetime_add: v }, { showDurationsInFrames }) => {
          const n = Number(v);
          if (showDurationsInFrames) {
            return `${round(Math.max(0, n), 0)} fr${
              n < 0 ? `  (${sign(n)} fr)` : ``
            }`;
          } else {
            const s = toSeconds(n);
            return `${round(Math.max(0, s), 2)} s${
              n < 0 ? `  (${sign(s)} s)` : ``
            }`;
          }
        },
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
          signZero(round(Number(v), 1), <Unchanged />),
      },
      {
        icon: `background-image: url('/data/icons/t_shape.png');`,
        field: 'pattern_degrees',
        displayName: 'Pattern Angle',
        render: ({ pattern_degrees: v }) =>
          signZero(round(Number(v), 1), <Unchanged />),
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
          Number(v) !== 1 ? `× ${v}` : <Unchanged />,
      },
    ],
  },

  {
    title: 'Crit',
    fields: [
      {
        icon: `background-image: url('/data/wand/icon_damage_critical_chance.png');`,
        field: 'damage_critical_chance',
        displayName: 'Chance',
        render: ({ damage_critical_chance: v }) => `${sign(Number(v))}%`,
      },
      {
        field: 'damage_critical_multiplier',
        displayName: 'Multiplier',
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
      // {field: 'sound_loop_tag', displayName: 'Sound Loop Tag', render: ({: v}) => `${v}`},
      {
        field: 'physics_impulse_coeff',
        displayName: 'Physics Impulse Coeff.',
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
                      × {count}
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

  // {
  //   title: 'GFX',
  //   fields: [
  //     { field: 'light', displayName: 'Light', render: ({: v}) => `${v}` },
  //     { field: 'sprite', displayName: 'Sprite', render: ({: v}) => `${v}` },
  //     {
  //       field: 'blood_count_multiplier',
  //       displayName: 'Blood Count Multiplier',
  //       render: ({: v}) => `${v}`,
  //     },
  //     {
  //       field: 'gore_particles',
  //       displayName: 'Gore Particles',
  //       render: ({: v}) => `${v}`,
  //     },
  //     {
  //       field: 'ragdoll_fx',
  //       displayName: 'Ragdoll FX',
  //       render: ({: v}) => `${v}`,
  //     },
  //   ],
  // },

  /*{
    title: 'Files',
    fields: [
      // {
      //   field: 'action_sprite_filename',
      //   displayName: 'Sprite file',
      //   render: ({: v}) => `${v}`,
      // },
      // {
      //   field: 'action_unidentified_sprite_filename',
      //   displayName: 'Sprite file (No ID)',
      //   render: ({: v}) => `${v}`,
      // },
      {
        field: 'custom_xml_file',
        displayName: 'Custom XML Files',
render: ({: v}) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) => (
                  <FilePath type={'xml'} key={name}>
                    {count}
                  </FilePath>
                ),
              )}
            </>
          ) : (
            `${v}`
          ),
      },
      // {
      // field: 'projectile_file',
      // displayName: 'Projectile File',
      // render: ({: v}) => `${v}`,
      // },
      {
        field: 'extra_entities',
        displayName: 'Extra Entities',
render: ({: v}) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) => (
                  <FilePath type={'xml'} key={name}>
                    {name}
                  </FilePath>
                ),
              )}
            </>
          ) : (
            `${v}`
          ),
      },
      {
        field: 'game_effect_entities',
        displayName: 'Game Effect Entities',
render: ({: v}) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) => (
                  <FilePath type={'xml'} key={name}>
                    {name.split('/')}
                  </FilePath>
                ),
              )}
            </>
          ) : (
            `${v}`
          ),
      },
    ],
    },*/

  /*{
    title: 'Action Info',
    fields: [
// {field: 'action_id', displayName: 'ID', render: ({: v}) => `${v}`},
      {
        field: 'action_name',
        displayName: 'Name',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_description',
        displayName: 'Desc.',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_type',
        displayName: 'Type',
render: ({: v}) => `${v}`,
      },

      {
        field: 'action_draw_many_count',
        displayName: 'Draw',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_never_unlimited',
        displayName: 'Never Unlimited',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_max_uses',
        displayName: 'Max. Charges',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_mana_drain',
        displayName: 'Mana',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_spawn_level',
        displayName: 'Spawn Level',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_spawn_probability',
        displayName: 'Spawn Probability',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_spawn_requires_flag',
        displayName: 'Spawn Requires Flag',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_spawn_manual_unlock',
        displayName: 'Spawn Manual Unlock',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_ai_never_uses',
        displayName: 'AI Never Uses',
render: ({: v}) => `${v}`,
      },
    ],
  },*/
];

// todo: handle extra_entities that affect damage/etc

export const ProjectileCastState = ({
  castState,
  manaDrain,
  rechargeTime,
  trigger = false,
}: {
  castState?: GunActionState;
  manaDrain?: number;
  rechargeTime?: number;
  trigger?: boolean;
}) => {
  const config = useConfig();
  const { castShowChanged } = config;

  if (!castState) {
    return null;
  }

  const extendedCastState = { ...castState, manaDrain };

  return (
    <>
      {fieldSections.map(({ title, fields, sectionIcon }) => {
        return (
          <>
            <ListTitle icon={sectionIcon}>{title}</ListTitle>
            <StyledList>
              {fields.map(
                ({
                  field,
                  displayName,
                  render,
                  key,
                  icon,
                  ignoredInTrigger = false,
                }) => {
                  if (
                    castShowChanged &&
                    castState[field] === defaultGunActionState[field]
                  ) {
                    return null;
                  }
                  return (
                    <StyledListItem key={key ?? field} icon={icon ?? ''}>
                      <StyledName>{displayName}</StyledName>
                      <StyledValue>
                        {!trigger || !ignoredInTrigger
                          ? render(extendedCastState, config)
                          : 'ignored'}
                      </StyledValue>
                    </StyledListItem>
                  );
                },
              )}
            </StyledList>
          </>
        );
      })}
    </>
  );
};

/* Unused/obsolete */
/* This is never set by any spell and defaults to zero
   * {
        field: 'explosion_damage_to_materials',
        displayName: 'Damages Materials',
        render: ({ explosion_damage_to_materials: v }) => `${v}`,
        },

      {
        field: 'damage_explosion',
        displayName: 'Damage',
        render: ({ damage_explosion: v }) =>
          `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        field: 'dampening',
        displayName: 'Dampening',
        render: ({ dampening: v }) => `${v}`,
      },
      {
        icon: `background-image: url('/data/wand/icon_speed_multiplier.png');`,
        field: 'child_speed_multiplier',
        displayName: 'Child Mult.',
        render: ({ child_speed_multiplier: v }) =>
          Number(v) !== 1 ? `× ${v}` : `--`,
      },
      {
        field: 'action_is_dangerous_blast',
        displayName: 'Dangerous Blast',
render: ({: v}) => `${v}`,
      },
   */
// {
//   title: 'State Flags',
//   fields: [
//     {
//       field: 'state_shuffled',
//       displayName: 'Deck Shuffled',
//       render: ({: v}) => `${formatYesNo(Boolean(v))}`,
//     },
//     {
//       field: 'state_cards_drawn',
//       displayName: 'Cards Drawn',
//       render: ({: v}) => `${Number(v)}`,
//     },
//   ],
// },

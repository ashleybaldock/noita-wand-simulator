import styled from 'styled-components/macro';
import {
  defaultGunActionState,
  GunActionState,
} from '../../../calc/actionState';
import { TrailMaterial } from '../../../calc/materials';
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
import { useAppSelector } from '../../../redux/hooks';
import { selectConfig } from '../../../redux/configSlice';
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

const ListTitle = styled.div<{ icon?: string }>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;

  padding: 0.4em 1em 0 1em;
  background-position: 0 50%;
  background-size: 1.4em;
  ${({ icon }) =>
    icon ? `background-image: url(${icon});` : 'background-image: none;'};
  background-repeat: no-repeat;
  image-rendering: pixelated;
`;

const MaterialTrail = styled.span<{
  type: TrailMaterial | string;
}>`
  display: block;
  &::after {
    content: '${({ type }) => type}:';
    content: '';
    padding: 0.4em 1em 0 1em;
    background-position: 50% 50%;
    background-size: 1.4em;
    background-image: url('/data/trail/trail_${({ type }) => type}.png');
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

type ValueOf<T> = T[keyof T];

type FieldDescription = {
  icon?: string;
  field: keyof GunActionState;
  key?: string;
  displayName: string;
  render: (
    actionState: GunActionState,
    value: ValueOf<GunActionState>,
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
        field: 'fire_rate_wait',
        displayName: 'Cast Delay',
        render: (_, v) => {
          const n = Number(v);
          const s = toSeconds(n);
          return `${Math.max(0, s)} s${n < 0 ? `  (${sign(s)} s)` : ``}`;
        },
      },
      {
        field: 'reload_time',
        displayName: 'Recharge Delay',
        render: (_, v) => `${sign(round(Number(v) / 60, 2))}s`,
      },
      {
        field: 'lifetime_add',
        displayName: 'Lifetime',
        render: (_, v) => `${signZero(Number(v))}`,
      },
    ],
  },

  {
    title: 'Misc.',
    fields: [
      {
        field: 'bounces',
        displayName: 'Bounces',
        render: (_, v) => `${signZero(Number(v))}`,
      },
      {
        field: 'gravity',
        displayName: 'Gravity',
        render: (_, v) => `${signZero(Number(v))}`,
      },
      {
        field: 'friendly_fire',
        displayName: 'Friendly Fire',
        render: (_, v) => `${formatYesNo(Boolean(v))}`,
      },
    ],
  },

  {
    title: 'Formation & Spread',
    fields: [
      {
        field: 'spread_degrees',
        displayName: 'Spread',
        render: (_, v) => `${sign(round(Number(v), 1))} DEG`,
      },
      {
        field: 'pattern_degrees',
        displayName: 'Pattern Angle',
        render: (_, v) => `±${round(Number(v), 0)} DEG`,
      },
    ],
  },

  {
    title: 'Speed',
    fields: [
      {
        field: 'speed_multiplier',
        displayName: 'Multiplier',
        render: (_, v) => (Number(v) !== 1 ? `× ${v}` : `--`),
      },
      {
        field: 'child_speed_multiplier',
        displayName: 'Child Mult.',
        render: (_, v) => (Number(v) !== 1 ? `× ${v}` : `--`),
      },
    ],
  },

  {
    title: 'Recoil',
    fields: [
      { field: 'recoil', displayName: 'Recoil', render: (_, v) => `${v}` },
      {
        field: 'knockback_force',
        displayName: 'Knockback',
        render: (_, v) => `${v}`,
      },
      {
        field: 'screenshake',
        displayName: 'Screen Shake',
        render: (_, v) => `${v}`,
      },
      // {field: 'sound_loop_tag', displayName: 'Sound Loop Tag', render: (_, v) => `${v}`},
      {
        field: 'dampening',
        displayName: 'Dampening',
        render: (_, v) => `${v}`,
      },
    ],
  },

  {
    title: 'Crit',
    fields: [
      {
        field: 'damage_critical_chance',
        displayName: 'Chance',
        render: (_, v) => `${sign(Number(v))}%`,
      },
      {
        field: 'damage_critical_multiplier',
        displayName: 'Multiplier',
        render: (_, v) => `${v}`,
      },
    ],
  },
  {
    title: 'Damage',
    fields: [
      {
        icon: `background-image: url('/data/ui_gfx/gun_actions/zero_damage.png');`,
        field: 'damage_null_all',
        displayName: 'All Null',
        render: (_, v) => `${formatYesNo(Boolean(v))}`,
      },

      {
        icon: getBackgroundUrlForDamageType('melee'),
        field: 'damage_melee_add',
        displayName: 'Melee',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('projectile'),
        field: 'damage_projectile_add',
        displayName: 'Projectile',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('electricity'),
        field: 'damage_electricity_add',
        displayName: 'Electric',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('fire'),
        field: 'damage_fire_add',
        displayName: 'Fire',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('ice'),
        field: 'damage_ice_add',
        displayName: 'Ice',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('slice'),
        field: 'damage_slice_add',
        displayName: 'Slice',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('heal'),
        field: 'damage_healing_add',
        displayName: 'Healing',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('curse'),
        field: 'damage_curse_add',
        displayName: 'Curse',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('holy'),
        field: 'damage_holy_add',
        displayName: 'Holy',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('drill'),
        field: 'damage_drill_add',
        displayName: 'Drill',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: getBackgroundUrlForDamageType('explosion'),
        field: 'damage_explosion_add',
        displayName: 'Explosion',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
    ],
  },
  {
    title: 'Explosion',
    fields: [
      {
        field: 'damage_explosion',
        displayName: 'Damage',
        render: (_, v) => `${signZero(round(Number(v) * 25, 0))}`,
      },
      {
        icon: 'data/wand/icon_explosion_radius.png',
        field: 'explosion_radius',
        displayName: 'Radius',
        render: (_, v) => `${signZero(Number(v))}`,
      },
      {
        key: 'explosion_radius_threshold',
        field: 'explosion_radius',
        displayName: 'Threshold Min.',
        render: (_, v) => `${radiusThresholdBonus(Number(v))}`,
      },
    ],
  },

  {
    title: 'Terrain',
    fields: [
      {
        field: 'explosion_damage_to_materials',
        displayName: 'Expl. Damage Materials',
        render: (_, v) => `${v}`,
      },
      {
        field: 'physics_impulse_coeff',
        displayName: 'Physics Impulse Coeff.',
        render: (_, v) => `${v}`,
      },
      {
        field: 'lightning_count',
        displayName: 'Lightning Count',
        render: (_, v) => `${v}`,
      },
    ],
  },

  {
    title: 'Materials',
    fields: [
      { field: 'material', displayName: 'Material', render: (_, v) => `${v}` },
      {
        field: 'material_amount',
        displayName: 'Material Amount',
        render: (_, v) => `${v}`,
      },
    ],
  },

  {
    title: 'Trails',
    fields: [
      {
        field: 'trail_material',
        displayName: 'Trails:',
        render: (_, v) =>
          isString(v) ? (
            <>
              {tally(v.split(',').filter((v) => v.length > 0)).map(
                ([name, count]) => (
                  <MaterialTrail type={name} key={name}>
                    × {count}
                  </MaterialTrail>
                ),
              )}
            </>
          ) : (
            `${v}`
          ),
      },
      {
        field: 'trail_material_amount',
        displayName: 'Trail Amount',
        render: (_, v) => `${v}`,
      },
    ],
  },

  // {
  //   title: 'GFX',
  //   fields: [
  //     { field: 'light', displayName: 'Light', render: (_, v) => `${v}` },
  //     { field: 'sprite', displayName: 'Sprite', render: (_, v) => `${v}` },
  //     {
  //       field: 'blood_count_multiplier',
  //       displayName: 'Blood Count Multiplier',
  //       render: (_, v) => `${v}`,
  //     },
  //     {
  //       field: 'gore_particles',
  //       displayName: 'Gore Particles',
  //       render: (_, v) => `${v}`,
  //     },
  //     {
  //       field: 'ragdoll_fx',
  //       displayName: 'Ragdoll FX',
  //       render: (_, v) => `${v}`,
  //     },
  //   ],
  // },

  {
    title: 'Files',
    fields: [
      // {
      //   field: 'action_sprite_filename',
      //   displayName: 'Sprite file',
      //   render: (_, v) => `${v}`,
      // },
      // {
      //   field: 'action_unidentified_sprite_filename',
      //   displayName: 'Sprite file (No ID)',
      //   render: (_, v) => `${v}`,
      // },
      {
        field: 'custom_xml_file',
        displayName: 'Custom XML Files',
        render: (_, v) =>
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
      // render: (_, v) => `${v}`,
      // },
      {
        field: 'extra_entities',
        displayName: 'Extra Entities',
        render: (_, v) =>
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
        render: (_, v) =>
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
  },

  // {
  //   title: 'State Flags',
  //   fields: [
  //     {
  //       field: 'state_shuffled',
  //       displayName: 'Deck Shuffled',
  //       render: (_, v) => `${formatYesNo(Boolean(v))}`,
  //     },
  //     {
  //       field: 'state_cards_drawn',
  //       displayName: 'Cards Drawn',
  //       render: (_, v) => `${Number(v)}`,
  //     },
  //   ],
  // },

  /*{
    title: 'Action Info',
    fields: [
      // {field: 'action_id', displayName: 'ID', render: (_, v) => `${v}`},
      {
        field: 'action_name',
        displayName: 'Name',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_description',
        displayName: 'Desc.',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_type',
        displayName: 'Type',
        render: (_, v) => `${v}`,
      },

      {
        field: 'action_draw_many_count',
        displayName: 'Draw',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_never_unlimited',
        displayName: 'Never Unlimited',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_max_uses',
        displayName: 'Max. Charges',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_mana_drain',
        displayName: 'Mana',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_spawn_level',
        displayName: 'Spawn Level',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_spawn_probability',
        displayName: 'Spawn Probability',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_spawn_requires_flag',
        displayName: 'Spawn Requires Flag',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_spawn_manual_unlock',
        displayName: 'Spawn Manual Unlock',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_is_dangerous_blast',
        displayName: 'Dangerous Blast',
        render: (_, v) => `${v}`,
      },
      {
        field: 'action_ai_never_uses',
        displayName: 'AI Never Uses',
        render: (_, v) => `${v}`,
      },
    ],
  },*/
];

// todo: handle extra_entities that affect damage/etc

export const ProjectileCastState = ({
  castState,
}: {
  castState?: GunActionState;
}) => {
  const {
    config: { castShowChanged },
  } = useAppSelector(selectConfig);

  if (!castState) {
    return null;
  }
  return (
    <>
      {fieldSections.map(({ title, fields, sectionIcon }) => (
        <Section>
          <ListTitle icon={sectionIcon}>{title}</ListTitle>
          <StyledList>
            {fields.map(({ field, displayName, render, key, icon }) => {
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
                    {render(castState, castState[field])}
                  </StyledValue>
                </StyledListItem>
              );
            })}
          </StyledList>
        </Section>
      ))}
    </>
  );
};

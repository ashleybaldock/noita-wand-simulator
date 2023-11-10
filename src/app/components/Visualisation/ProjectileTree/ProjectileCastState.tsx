import styled from 'styled-components/macro';
import {
  defaultGunActionState,
  GunActionState,
} from '../../../calc/actionState';
import { formatYesNo, round, sign } from '../../../util/util';

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: monospace;
  color: #fff;
  font-weight: unset;
  font-size: 0.8em;
  min-width: 230px;
  border: 1px solid black;
  padding: 1px;
  font-family: var(--font-family-noita-default);
`;

const StyledListItem = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
`;

const StyledName = styled.span`
  text-align: left;
  flex: 0 0 150px;
`;

const StyledValue = styled.span`
  text-align: left;
  flex: 0 0 auto;
`;

type ValueOf<T> = T[keyof T];

type FieldDescription = {
  field: keyof GunActionState;
  displayName: string;
  render: (
    actionState: GunActionState,
    value: ValueOf<GunActionState>,
  ) => JSX.Element | string;
};

const fields: FieldDescription[] = [
  // {field: 'action_id', displayName: 'action_id', render: (_, v) => `${v}`},
  // {field: 'action_name', displayName: 'action_name', render: (_, v) => `${v}`},
  // {field: 'action_description', displayName: 'action_description', render: (_, v) => `${v}`},
  // {field: 'action_sprite_filename', displayName: 'action_sprite_filename', render: (_, v) => `${v}`},
  // {field: 'action_unidentified_sprite_filename', displayName: 'action_unidentified_sprite_filename', render: (_, v) => `${v}`},
  // {field: 'action_type', displayName: 'action_type', render: (_, v) => `${v}`},
  // {field: 'action_spawn_level', displayName: 'action_spawn_level', render: (_, v) => `${v}`},
  // {field: 'action_spawn_probability', displayName: 'action_spawn_probability', render: (_, v) => `${v}`},
  // {field: 'action_spawn_requires_flag', displayName: 'action_spawn_requires_flag', render: (_, v) => `${v}`},
  // {field: 'action_spawn_manual_unlock', displayName: 'action_spawn_manual_unlock', render: (_, v) => `${v}`},
  // {field: 'action_max_uses', displayName: 'action_max_uses', render: (_, v) => `${v}`},
  // {field: 'custom_xml_file', displayName: 'custom_xml_file', render: (_, v) => `${v}`},
  // {field: 'action_mana_drain', displayName: 'action_mana_drain', render: (_, v) => `${v}`},
  // {field: 'action_is_dangerous_blast', displayName: 'action_is_dangerous_blast', render: (_, v) => `${v}`},
  // {field: 'action_draw_many_count', displayName: 'action_draw_many_count', render: (_, v) => `${v}`},
  // {field: 'action_ai_never_uses', displayName: 'action_ai_never_uses', render: (_, v) => `${v}`},
  // {field: 'action_never_unlimited', displayName: 'action_never_unlimited', render: (_, v) => `${v}`},
  {
    field: 'state_shuffled',
    displayName: 'Deck Shuffled',
    render: (_, v) => `${formatYesNo(Boolean(v))}`,
  },
  {
    field: 'state_cards_drawn',
    displayName: 'Cards Drawn',
    render: (_, v) => `${formatYesNo(Boolean(v))}`,
  },
  {
    field: 'state_discarded_action',
    displayName: 'Discarded',
    render: (_, v) => `${formatYesNo(Boolean(v))}`,
  },
  {
    field: 'state_destroyed_action',
    displayName: 'Destroyed',
    render: (_, v) => `${formatYesNo(Boolean(v))}`,
  },
  {
    field: 'fire_rate_wait',
    displayName: 'Cast Delay',
    render: (_, v) => `${sign(round(Number(v) / 60, 2))}s`,
  },
  {
    field: 'speed_multiplier',
    displayName: 'Speed',
    render: (_, v) => `${round(Number(v), 5)}x`,
  },
  {
    field: 'child_speed_multiplier',
    displayName: 'Child Speed',
    render: (_, v) => `${v}x`,
  },
  { field: 'dampening', displayName: 'Dampening', render: (_, v) => `${v}` },
  {
    field: 'explosion_radius',
    displayName: 'Explosion Radius',
    render: (_, v) => `${sign(Number(v))}`,
  },
  {
    field: 'spread_degrees',
    displayName: 'Spread',
    render: (_, v) => `${sign(round(Number(v), 1))} deg`,
  },
  {
    field: 'pattern_degrees',
    displayName: 'Pattern Angle',
    render: (_, v) => `±${round(Number(v), 0)} deg`,
  },
  // {field: 'screenshake', displayName: 'screenshake', render: (_, v) => `${v}`},
  { field: 'recoil', displayName: 'Recoil', render: (_, v) => `${v}` },
  {
    field: 'damage_melee_add',
    displayName: 'damage_melee_add',
    render: (_, v) => `${v}`,
  },
  {
    field: 'damage_projectile_add',
    displayName: 'Projectile Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_electricity_add',
    displayName: 'Electricity Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_fire_add',
    displayName: 'Fire Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_explosion_add',
    displayName: 'Explosion Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_ice_add',
    displayName: 'Ice Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_slice_add',
    displayName: 'Slice Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_healing_add',
    displayName: 'Healing Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_curse_add',
    displayName: 'Curse Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_holy_add',
    displayName: 'Holy Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_drill_add',
    displayName: 'Drill Damage',
    render: (_, v) => `${sign(round(Number(v) * 25, 0))}`,
  },
  {
    field: 'damage_critical_chance',
    displayName: 'Critical Chance',
    render: (_, v) => `${sign(Number(v))}%`,
  },
  {
    field: 'damage_critical_multiplier',
    displayName: 'damage_critical_multiplier',
    render: (_, v) => `${v}`,
  },
  {
    field: 'explosion_damage_to_materials',
    displayName: 'explosion_damage_to_materials',
    render: (_, v) => `${v}`,
  },
  {
    field: 'knockback_force',
    displayName: 'knockback_force',
    render: (_, v) => `${v}`,
  },
  {
    field: 'reload_time',
    displayName: 'Recharge Delay',
    render: (_, v) => `${sign(round(Number(v) / 60, 2))}s`,
  },
  {
    field: 'lightning_count',
    displayName: 'lightning_count',
    render: (_, v) => `${v}`,
  },
  { field: 'material', displayName: 'Material', render: (_, v) => `${v}` },
  // {field: 'material_amount', displayName: 'material_amount', render: (_, v) => `${v}`},
  {
    field: 'trail_material',
    displayName: 'Material Trails',
    render: (_, v) => `${v}`,
  },
  // {field: 'trail_material_amount', displayName: 'trail_material_amount', render: (_, v) => `${v}`},
  { field: 'bounces', displayName: 'Bounces', render: (_, v) => `${v}` },
  { field: 'gravity', displayName: 'Gravity', render: (_, v) => `${v}` },
  { field: 'light', displayName: 'Light', render: (_, v) => `${v}` },
  {
    field: 'blood_count_multiplier',
    displayName: 'Blood Count Multiplier',
    render: (_, v) => `${v}`,
  },
  // {field: 'gore_particles', displayName: 'gore_particles', render: (_, v) => `${v}`},
  // {field: 'ragdoll_fx', displayName: 'ragdoll_fx', render: (_, v) => `${v}`},
  {
    field: 'friendly_fire',
    displayName: 'Friendly Fire',
    render: (_, v) => `${v}`,
  },
  {
    field: 'physics_impulse_coeff',
    displayName: 'Physics Impulse Coeff.',
    render: (_, v) => `${v}`,
  },
  {
    field: 'lifetime_add',
    displayName: 'Lifetime Modifier',
    render: (_, v) => `${sign(Number(v))}`,
  },
  { field: 'sprite', displayName: 'sprite', render: (_, v) => `${v}` },
  // {field: 'extra_entities', displayName: 'extra_entities', render: (_, v) => `${v}`},
  // {field: 'game_effect_entities', displayName: 'game_effect_entities', render: (_, v) => `${v}`},
  // {field: 'sound_loop_tag', displayName: 'sound_loop_tag', render: (_, v) => `${v}`},
  {
    field: 'projectile_file',
    displayName: 'projectile_file',
    render: (_, v) => `${v}`,
  },
];

// todo: handle extra_entities that affect damage/etc

export const ProjectileCastState = ({
  castState,
}: {
  castState?: GunActionState;
}) => {
  if (!castState) {
    return null;
  }
  return (
    <StyledList>
      {fields.map(({ field, displayName, render }) => {
        if (castState[field] === defaultGunActionState[field]) {
          return null;
        }
        return (
          <StyledListItem key={field}>
            <StyledName>{displayName}</StyledName>
            <StyledValue>{render(castState, castState[field])}</StyledValue>
          </StyledListItem>
        );
      })}
    </StyledList>
  );
};

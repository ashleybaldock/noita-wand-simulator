import { isNotNullOrUndefined } from '../util';
import * as beta from './__generated__/beta/unlocks';

export type UnlockCondition = (typeof beta.unlockConditions)[number];

export const unlockConditions = beta.unlockConditions;

type UnlockInfo = {
  name: string;
};

const unlockInfo: Record<UnlockCondition, UnlockInfo> = {
  card_unlocked_alchemy: { name: 'Dark Chest' },
  card_unlocked_black_hole: { name: 'As Above, So Below' },
  card_unlocked_bomb_holy: { name: 'Orb: Holy Bomb' },
  card_unlocked_bomb_holy_giga: { name: 'Friendly Avarice' },
  card_unlocked_cloud_thunder: { name: 'Orb: Thundercloud' },
  card_unlocked_crumbling_earth: { name: 'Orb: Earthquake' },
  card_unlocked_destruction: { name: 'Remove Cheese' },
  card_unlocked_divide: { name: 'Avarice' },
  card_unlocked_dragon: { name: 'Defeat Suomuhauki' },
  card_unlocked_duplicate: { name: 'Defeat Ylialkemisti' },
  card_unlocked_everything: { name: 'Broken Spell' },
  card_unlocked_exploding_deer: { name: 'Orb: Deercoy' },
  card_unlocked_firework: { name: 'Orb: Fireworks' },
  card_unlocked_fish: { name: 'Fishy Finnish Mythology' },
  card_unlocked_funky: { name: 'Totally A Wand' },
  card_unlocked_homing_wand: { name: 'Defeat Mestarien mestari II' },
  card_unlocked_kantele: { name: 'Kantele' },
  card_unlocked_material_cement: { name: 'Orb: Cement' },
  card_unlocked_maths: { name: 'Experimental Wand II' },
  card_unlocked_mestari: { name: 'Defeat Mestarien mestari' },
  card_unlocked_musicbox: { name: 'Coral Chest' },
  card_unlocked_necromancy: { name: 'Orb: Necromancy' },
  card_unlocked_nuke: { name: 'Orb: Nuke' },
  card_unlocked_nukegiga: { name: 'Friendly Avarice II' },
  card_unlocked_ocarina: { name: 'Huilu' },
  card_unlocked_paint: { name: 'Experimental Wand I' },
  card_unlocked_pyramid: { name: 'Defeat Kolmisilmän koipi' },
  card_unlocked_rain: { name: 'Defeat Sauvojen tuntija' },
  card_unlocked_rainbow_trail: { name: 'Find Source Of Rainbows' },
  card_unlocked_sea_lava: { name: 'Orb: Lava' },
  card_unlocked_spiral_shot: { name: 'Orb: Spiral Shot' },
  card_unlocked_tentacle: { name: 'Orb: Tentacle' },
  // 'card_unlocked_': {name: 'Defeat Tapion vasalli'},
} as const;

export const getUnlockName = (unlockCondition: UnlockCondition) =>
  isNotNullOrUndefined(unlockCondition)
    ? unlockInfo[unlockCondition].name
    : 'Unknown Unlock';

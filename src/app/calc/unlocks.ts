import { isNotNullOrUndefined } from '../util';
import * as main from './__generated__/main/unlocks';

export type UnlockCondition = (typeof main.unlockConditions)[number];

export const unlockConditions = main.unlockConditions;

export const UnlockGroups = [
  'Quests',
  'Achievements',
  'Orbs',
  'Bosses',
  'Secrets',
] as const;

type UnlockGroup = (typeof UnlockGroups)[number];

type UnlockInfo = {
  name: string;
  group: UnlockGroup;
};

const unlockInfo: Record<UnlockCondition, UnlockInfo> = {
  card_unlocked_alchemy: { name: 'Dark Chest', group: 'Quests' },
  card_unlocked_black_hole: {
    name: 'As Above, So Below',
    group: 'Achievements',
  },
  card_unlocked_bomb_holy: { name: 'Orb: Holy Bomb', group: 'Orbs' },
  card_unlocked_bomb_holy_giga: {
    name: 'Friendly Avarice',
    group: 'Achievements',
  },
  card_unlocked_cloud_thunder: { name: 'Orb: Thundercloud', group: 'Orbs' },
  card_unlocked_crumbling_earth: { name: 'Orb: Earthquake', group: 'Orbs' },
  card_unlocked_destruction: { name: 'Remove Cheese', group: 'Achievements' },
  card_unlocked_divide: { name: 'Avarice', group: 'Secrets' },
  card_unlocked_dragon: { name: 'Defeat the Dragon', group: 'Bosses' },
  card_unlocked_duplicate: { name: 'Defeat the Alchemist', group: 'Bosses' },
  card_unlocked_everything: { name: 'Broken Spell', group: 'Quests' },
  card_unlocked_exploding_deer: { name: 'Orb: Deercoy', group: 'Orbs' },
  card_unlocked_firework: { name: 'Orb: Fireworks', group: 'Orbs' },
  card_unlocked_fish: { name: 'Fishy Mythology', group: 'Quests' },
  card_unlocked_funky: { name: 'Totally A Wand', group: 'Secrets' },
  card_unlocked_homing_wand: { name: 'Defeat MofM II', group: 'Bosses' },
  card_unlocked_kantele: { name: 'Kantele', group: 'Secrets' },
  card_unlocked_material_cement: { name: 'Orb: Cement', group: 'Orbs' },
  card_unlocked_maths: { name: 'Experimental Wand II', group: 'Quests' },
  card_unlocked_mestari: { name: 'Defeat MofM', group: 'Bosses' },
  card_unlocked_musicbox: { name: 'Coral Chest', group: 'Quests' },
  card_unlocked_necromancy: { name: 'Orb: Necromancy', group: 'Orbs' },
  card_unlocked_nuke: { name: 'Orb: Nuke', group: 'Orbs' },
  card_unlocked_nukegiga: {
    name: 'Friendly Avarice II',
    group: 'Achievements',
  },
  card_unlocked_ocarina: { name: 'Huilu', group: 'Secrets' },
  card_unlocked_paint: { name: 'Experimental Wand I', group: 'Quests' },
  card_unlocked_pyramid: { name: 'Defeat Legs', group: 'Bosses' },
  card_unlocked_rain: { name: 'Defeat Connoisseur', group: 'Bosses' },
  card_unlocked_rainbow_trail: { name: 'End of the Rainbow', group: 'Secrets' },
  card_unlocked_sea_lava: { name: 'Orb: Lava', group: 'Orbs' },
  card_unlocked_spiral_shot: { name: 'Orb: Spiral Shot', group: 'Orbs' },
  card_unlocked_tentacle: { name: 'Orb: Tentacle', group: 'Orbs' },
  card_unlocked_cessation: { name: 'Cessation', group: 'Secrets' },
  card_unlocked_piss: { name: 'All That Glitters', group: 'Secrets' },
  card_unlocked_sea_mimic: { name: 'Awaken Potions', group: 'Quests' },
  card_unlocked_polymorph: { name: 'Defeat Tapion vasalli', group: 'Bosses' },
  card_unlocked_touch_grass: { name: 'Ominous Reward', group: 'Quests' },
} as const;

export const getUnlockName = (unlockCondition: UnlockCondition) =>
  isNotNullOrUndefined(unlockCondition)
    ? unlockInfo[unlockCondition].name
    : 'Unknown Unlock';

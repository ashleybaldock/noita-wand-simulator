import type { SpellDeckInfo } from '../spell';
import type { WandShotId } from './WandShot';

export type ShotProjectile = {
  _typeName: 'Projectile';
  entity: string;
  spell?: SpellDeckInfo;
  proxy?: SpellDeckInfo;
  trigger?: WandShotId;
  deckIndex?: string | number;
};

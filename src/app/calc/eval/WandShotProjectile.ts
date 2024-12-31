import type { ProjectileId } from '../projectile';
import type { SpellDeckInfo } from '../spell';
import type { WandShotId } from './WandShot';

export type WandShotProjectile = {
  _typeName: 'Projectile';
  entity: ProjectileId;
  /**
   * The action that this projectile was sourced from
   */
  spell?: SpellDeckInfo;
  /**
   * The action that created this projectile
   * (Only for projectiles created directly,
   *  using related_projectiles, e.g. Add Trigger)
   */
  proxy?: SpellDeckInfo;
  /**
   * Payload iff this is a Trigger projectile
   */
  payload?: WandShotId;
};

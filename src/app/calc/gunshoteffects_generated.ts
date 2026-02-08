import { RegisterGunShotEffects } from './eval/dispatch';
import type { ShotEffects } from './gun';

export function ConfigGunShotEffects_Init(value: ShotEffects) {
  value.recoil_knockback = 0;
}

export function ConfigGunShotEffects_PassToGame(value: ShotEffects) {
  RegisterGunShotEffects(value.recoil_knockback);
}

//ext function
export function ConfigGunShotEffects_ReadToLua(/*recoil_knockback: number*/) {}

export function ConfigGunShotEffects_Copy(
  source: ShotEffects,
  dest: ShotEffects,
) {
  dest.recoil_knockback = source.recoil_knockback;
}

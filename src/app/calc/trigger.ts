import { isNotNullOrUndefined } from '../util';
import type { WandEventName } from './eval/wandEvent';
import { WandEventBase } from './eval/wandEvent';

export const TriggerConditionDefinition = {
  hit: { event: 'BeginTriggerHitWorld', sprite: 'data/icons/trigger-mod.png' },
  timer: { event: 'BeginTriggerTimer', sprite: 'data/icons/timer-mod.png' },
  expire: { event: 'BeginTriggerDeath', sprite: 'data/icons/death-mod.png' },
} as const;

export type TriggerCondition = keyof typeof TriggerConditionDefinition;

type TriggerConditionInfo = {
  sprite: (typeof TriggerConditionDefinition)[TriggerCondition]['sprite'];
  event: WandEventName;
};

export type TriggerConditionInfoRecord = Readonly<
  Record<TriggerCondition, Readonly<TriggerConditionInfo>>
>;

export const triggerConditionInfoRecord =
  TriggerConditionDefinition as TriggerConditionInfoRecord;

export const triggerConditionFor = (
  wandEvent: WandEventName,
): TriggerCondition | undefined => {
  if (wandEvent === 'BeginTriggerHitWorld') {
    return 'hit';
  }
  if (wandEvent === 'BeginTriggerTimer') {
    return 'timer';
  }
  if (wandEvent === 'BeginTriggerDeath') {
    return 'expire';
  }
  return undefined;
};

export const getSpriteForTrigger = (triggerType: TriggerCondition) =>
  triggerConditionInfoRecord[triggerType].sprite;

export type TriggerCondition = 'hit' | 'timer' | 'expire';

const triggerEventToConditionMap = new Map<string, TriggerCondition>([
  ['BeginTriggerHitWorld', 'hit'],
  ['BeginTriggerTimer', 'timer'],
  ['BeginTriggerDeath', 'expire'],
]);

export const getTriggerConditionForEvent = (triggerEvent: string) =>
  triggerEventToConditionMap.get(triggerEvent);

const triggerIconMap = new Map<TriggerCondition, string>([
  ['hit', 'data/icons/trigger-mod.png'],
  ['timer', 'data/icons/timer-mod.png'],
  ['expire', 'data/icons/death-mod.png'],
]);

export const getIconForTrigger = (triggerType: TriggerCondition) =>
  triggerIconMap.get(triggerType);

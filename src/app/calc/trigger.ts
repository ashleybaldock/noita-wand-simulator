export type TriggerCondition = 'hit' | 'timer' | 'expire';

const triggerIconMap = new Map<TriggerCondition, string>([
  ['hit', 'data/icons/trigger-mod.png'],
  ['timer', 'data/icons/timer-mod.png'],
  ['expire', 'data/icons/death-mod.png'],
]);

export const getIconForTrigger = (triggerType: TriggerCondition) =>
  triggerIconMap.get(triggerType);

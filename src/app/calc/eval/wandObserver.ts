import type { WandEvent, WandObserverCb } from './wandEvent';

export const observer = (() => {
  const defaultListener = (payload: WandEvent) => payload?.default;
  let listener: WandObserverCb = defaultListener;
  const remove = () => (listener = defaultListener);
  return {
    subscribe: (callback: WandObserverCb) => {
      listener = callback;
      return () => listener === callback && remove();
    },
    onEvent: <W extends WandEvent>(wandEvent: W) => listener(wandEvent),
  };
})();

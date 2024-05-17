import { noop } from '../../util';
import type { WandEvent, WandObserverCb } from './wandEvent';

export const observer = (() => {
  let listener: WandObserverCb = noop;
  const remove = () => (listener = noop);
  return {
    subscribe: (callback: WandObserverCb) => {
      listener = callback;
      return () => listener === callback && remove();
    },
    onEvent: <W extends WandEvent>(wandEvent: W) => listener(wandEvent),
  };
})();

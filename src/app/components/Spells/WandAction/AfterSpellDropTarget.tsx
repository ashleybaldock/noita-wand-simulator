import type { WandIndex } from '../../../redux/WandIndex';
import { BetweenSpellsDropTarget } from './BetweenSpellsDropTarget';

export const AfterSpellDropTarget = ({
  wandIndex,
  className = '',
}: {
  wandIndex: WandIndex;
  className?: string;
}) => {
  return (
    <BetweenSpellsDropTarget
      data-name="DropTargetAfter"
      wandIndex={wandIndex}
      location={'after'}
      className={className}
    ></BetweenSpellsDropTarget>
  );
};

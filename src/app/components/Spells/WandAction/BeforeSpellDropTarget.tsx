import { BetweenSpellsDropTarget } from './BetweenSpellsDropTarget';
import type { WandIndex } from '../../../redux/WandIndex';

export const BeforeSpellDropTarget = ({
  wandIndex,
  className = '',
}: {
  wandIndex: WandIndex;
  className?: string;
}) => {
  return (
    <BetweenSpellsDropTarget
      data-name="DropTargetBefore"
      wandIndex={wandIndex}
      location={'before'}
      className={className}
    ></BetweenSpellsDropTarget>
  );
};

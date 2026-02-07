import { StyledWandActionBorder } from './WandActionBorder';
import { OverSpellDropTarget } from './OverSpellDropTarget';
import { END, isMainWandIndex, type WandIndex } from '../../../redux/WandIndex';
import { BetweenSpellsDropTarget } from './BetweenSpellsDropTarget';

export const WandActionDropTargets = ({
  wandIndex,
  children,
}: React.PropsWithChildren<{
  wandIndex: WandIndex;
  lastIndex?: WandIndex;
}>) => {
  return (
    <OverSpellDropTarget wandIndex={wandIndex}>
      <StyledWandActionBorder>{children}</StyledWandActionBorder>
      {isMainWandIndex(wandIndex) && (
        <>
          <BetweenSpellsDropTarget
            indexOfSpellBefore={wandIndex}
            indexOfSpellAfter={wandIndex === 0 ? END : wandIndex - 1}
          />
        </>
      )}
    </OverSpellDropTarget>
  );
};

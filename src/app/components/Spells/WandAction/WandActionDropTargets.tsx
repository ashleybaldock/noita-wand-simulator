import { StyledWandActionBorder } from './WandActionBorder';
import { BeforeSpellDropTarget } from './BeforeSpellDropTarget';
import { AfterSpellDropTarget } from './AfterSpellDropTarget';
import { OverSpellDropTarget } from './OverSpellDropTarget';
import type { WandIndex } from '../../../redux/WandIndex';

export const WandActionDropTargets = ({
  wandIndex,
  children,
}: React.PropsWithChildren<{
  wandIndex: WandIndex;
}>) => {
  return (
    <OverSpellDropTarget wandIndex={wandIndex}>
      <StyledWandActionBorder>{children}</StyledWandActionBorder>
      <BeforeSpellDropTarget wandIndex={wandIndex} />
      <AfterSpellDropTarget wandIndex={wandIndex} />
    </OverSpellDropTarget>
  );
};

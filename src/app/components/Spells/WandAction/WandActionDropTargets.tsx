import { WandActionBorder } from './WandActionBorder';
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
      <WandActionBorder>{children}</WandActionBorder>
      <BeforeSpellDropTarget wandIndex={wandIndex} />
      <AfterSpellDropTarget wandIndex={wandIndex} />
      {/* <WandEditCursor */}
      {/*   wandIndex={wandIndex} */}
      {/*   isDropTarget={isDraggingSelect} */}
      {/*   isDragSource={!isDraggingSelect && !isDraggingAction} */}
      {/* /> */}
      {/* <WandEditCursor */}
      {/*   wandIndex={wandIndex} */}
      {/*   isDropTarget={isDraggingSelect} */}
      {/*   isDragSource={!isDraggingSelect && !isDraggingAction} */}
      {/* /> */}
    </OverSpellDropTarget>
  );
};

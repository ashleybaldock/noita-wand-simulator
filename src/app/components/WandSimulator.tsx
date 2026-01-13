import styled from 'styled-components';
import { SpellSelector, WandBuilder } from './WandEditor';
import { VisualisationList } from './Visualisation';
import { MainHeader } from './MainHeader';
import { DebugHints } from './Debug';
import { DndProvider } from 'react-dnd-multi-backend';
import { CastConfigEditor } from './config/CastConfigEditor';
import { ReleaseInfo } from './ReleaseInfo';
import { Tooltips } from './Tooltips';
import { Modals } from './Modals/Modals';
import { DragPreview } from './DragPreview';
import { HTML5toTouchPreview } from './DragPipeline';
import { SpellHotbar } from './SpellHotbar';

const StickyGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Overlays = styled.div`
  display: contents;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpellShortcuts = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
  width: 100%;
`;

export const WandSimulator = () => {
  return (
    <DebugHints>
      <DndProvider options={HTML5toTouchPreview}>
        <Column>
          <MainHeader></MainHeader>
          <StickyGroup>
            <SpellSelector />
            <SpellShortcuts>
              <SpellHotbar></SpellHotbar>
            </SpellShortcuts>
            <WandBuilder />
          </StickyGroup>
          <StickyGroup>
            <CastConfigEditor />
          </StickyGroup>
          <StickyGroup>
            <VisualisationList />
          </StickyGroup>
          <Overlays>
            <Modals />
            <Tooltips />
            <ReleaseInfo />
          </Overlays>
        </Column>
        <DragPreview />
      </DndProvider>
    </DebugHints>
  );
};

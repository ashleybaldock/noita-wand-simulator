import styled, { type DataAttributes } from 'styled-components';
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
import { SimulationStatus } from './SimulationStatus';
import { SpellSequence } from './SpellSequence/SpellSequence';
import { StickyHeading } from './Sticky/StickyHeading';
import { StickyGroup } from './Sticky/StickyGroup';
import { Column } from './generic';

const Overlays = styled.div.attrs<DataAttributes>({
  'data-name': 'Overlays',
})`
  display: contents;
`;

export const WandSimulator = () => {
  return (
    <DebugHints>
      <DndProvider options={HTML5toTouchPreview}>
        <Column>
          <MainHeader />
          <StickyHeading />
          <StickyGroup>
            <SpellSelector />
            <SpellHotbar />
            <WandBuilder />
          </StickyGroup>
          <SpellSequence />
          <SimulationStatus />
          <StickyGroup>
            <CastConfigEditor />
          </StickyGroup>
          <StickyGroup>
            <VisualisationList />
          </StickyGroup>
        </Column>
        <Overlays>
          <Modals />
          <Tooltips />
          <ReleaseInfo />
        </Overlays>
        <DragPreview />
      </DndProvider>
    </DebugHints>
  );
};

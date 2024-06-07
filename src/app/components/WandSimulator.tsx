import styled from 'styled-components';
import { SpellSelector, WandBuilder } from './WandEditor';
import { VisualisationList } from './Visualisation';
import { useAppDispatch } from '../redux/hooks';
import { toggleConfigSetting } from '../redux/configSlice';
import { MainHeader } from './MainHeader';
import { DebugHints } from './Debug';
import { DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
// import { forceDisableCanvasSmoothing } from '../util/util';
import { CastConfigEditor } from './config/CastConfigEditor';
import { ReleaseInfo } from './ReleaseInfo';
import { useHotkeys } from 'react-hotkeys-hook';
import { Tooltips } from './Tooltips';
import { Modals } from './Modals/Modals';
import { DragPreview } from './DragPreview';
import { HTML5toTouchPreview } from './DragPipeline';

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

const SpellHotbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  background-color: black;
`;

export const WandSimulator = () => {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   forceDisableCanvasSmoothing();
  // }, []);

  useHotkeys('=', () => {
    dispatch(toggleConfigSetting({ name: 'debug.dragHint' }));
  });

  return (
    <DebugHints>
      <DndProvider options={HTML5toTouchPreview}>
        <Column>
          <MainHeader></MainHeader>
          <Column>
            <WandBuilder />
            <SpellShortcuts>
              <SpellHotbar></SpellHotbar>
            </SpellShortcuts>
            <SpellSelector />
          </Column>
          <Column>
            <CastConfigEditor />
          </Column>
          <Column>
            <VisualisationList />
          </Column>
          <Modals />
          <Tooltips />
          <ReleaseInfo />
        </Column>
        <DragPreview />
      </DndProvider>
    </DebugHints>
  );
};

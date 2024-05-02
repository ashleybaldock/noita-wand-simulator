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
import { SpellDragPreview } from './DragPreview';

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

const Alpha = styled.div`
  font-size: 1.3em;
  padding: 1em;
  line-height: 1.8em;
  position: sticky;
  top: 0;
  border: 3px dashed red;
  color: red;
  background-color: black;
  z-index: 99999999;
  text-align: center;

  @media screen and (max-width: 600px) {
    padding: 0.8em;
    font-size: 0.9em;
  }
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
      <DndProvider options={HTML5toTouch}>
        <Column>
          <Alpha>
            This is a pre-release development preview - expect bugs.
            <br />
            Release version:{' '}
            <a href="https://tinker-with-wands-online.vercel.app">
              tinker-with-wands-online.vercel.app
            </a>
          </Alpha>
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
        <SpellDragPreview />
      </DndProvider>
    </DebugHints>
  );
};

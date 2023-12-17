import { useEffect } from 'react';
import styled from 'styled-components';
import { SpellSelector, WandBuilder } from './WandEditor';
import { VisualisationList } from './Visualisation';
import { useAppDispatch } from '../redux/hooks';
import { updateConfig, useConfig } from '../redux/configSlice';
import { MainHeader } from './MainHeader';
import { DebugHints } from './Debug';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { forceDisableCanvasSmoothing } from '../util/util';
import { CastConfigEditor } from './config/CastConfigEditor';
import { ReleaseInfo } from './ReleaseInfo';
import { useHotkeys } from 'react-hotkeys-hook';
import { SpellInfoTooltip } from './Tooltips';

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

export function WandSimulator() {
  const config = useConfig();
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   forceDisableCanvasSmoothing();
  // }, []);

  useHotkeys('=', () => {
    dispatch(
      updateConfig({
        debug: { ...config.debug, dragHint: !config.debug.dragHint },
      }),
    );
  });

  return (
    <DebugHints>
      <Column>
        <MainHeader></MainHeader>
        <Column>
          <DndProvider backend={HTML5Backend}>
            <WandBuilder />
            <SpellShortcuts>
              <SpellHotbar></SpellHotbar>
            </SpellShortcuts>
            <SpellSelector />
          </DndProvider>
        </Column>
        <Column>
          <CastConfigEditor />
        </Column>
        <Column>
          <VisualisationList {...config} />
        </Column>
        <SpellInfoTooltip />
        <ReleaseInfo />
      </Column>
    </DebugHints>
  );
}

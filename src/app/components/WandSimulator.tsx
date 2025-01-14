import { useEffect } from 'react';
import styled from 'styled-components/macro';
import { WandBuilder } from './WandBuilder';
import { ShotResultList } from './shotResult/ShotResultList';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectConfig } from '../redux/configSlice';
import { MainHeader } from './MainHeader';
import { SectionHeader } from './SectionHeader';
import { SpellSelector } from './SpellSelector';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { forceDisableCanvasSmoothing } from '../util/util';
import { CastConfigEditor } from './config/CastConfigEditor';

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
  const { config } = useAppSelector(selectConfig);
  useAppDispatch();

  useEffect(() => {
    forceDisableCanvasSmoothing();
  }, []);

  return (
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
        <SectionHeader
          title={`Simulation${config.pauseCalculations ? ' (Paused)' : ''}`}
        />
        {!config.pauseCalculations && <ShotResultList {...config} />}
        <div>Status: Running</div>
      </Column>
    </Column>
  );
}

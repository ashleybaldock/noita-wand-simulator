import { useEffect } from 'react';
import styled from 'styled-components/macro';
import { WandBuilder } from './WandBuilder';
import { ShotResultList } from './shotResult/ShotResultList';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectConfig } from '../redux/configSlice';
import { MainHeader } from './MainHeader';
import SectionHeader from './SectionHeader';
import { SpellSelector } from './SpellSelector';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ConfigButton } from './buttons';
import { forceDisableCanvasSmoothing } from '../util/util';
import { CastConfigEditor } from './config/CastConfigEditor';
import { ReleaseInfo } from './ReleaseInfo';
import { SaveImageButton } from './generic';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  width: 100%;
`;

export function WandSimulator() {
  const { config } = useAppSelector(selectConfig);
  useAppDispatch();

  useEffect(() => {
    forceDisableCanvasSmoothing();
  }, []);

  return (
    <Column>
      <ReleaseInfo />
      <MainHeader>
        <Row>
          <ConfigButton />
        </Row>
      </MainHeader>
      <Column>
        <DndProvider backend={HTML5Backend}>
          <WandBuilder />
          <Row>
            <SpellSelector />
          </Row>
          <CastConfigEditor />
        </DndProvider>
      </Column>
      <Column>
        <SectionHeader
          title={`Simulation${config.pauseCalculations ? ' (Paused)' : ''}`}
          rightChildren={<div>Status: Running</div>}
        />
        {!config.pauseCalculations && <ShotResultList {...config} />}
      </Column>
    </Column>
  );
}

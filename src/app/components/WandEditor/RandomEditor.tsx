import styled from 'styled-components';
import type {CSSProperties, PropsWithChildren} from 'react';
import {useConfigSetting, useIsRandomUsed} from '../../redux';
import {EditableWrapper} from '../Presentation';
import {useSprite} from '../../calc/sprite';
import {NumericInput} from '../Input';
import {WandStatName} from '../WandEditor/WandStatName';

const GridGroup = styled.div`
  display: grid;
  grid-column: auto/span 1;
  grid-row: auto/span 2;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
`;

const _RandomEditor = ({
  children,
  style,
  className,
  dataName = 'RandomEditor',
  disabled = false,
}: {
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  dataName?: string;
} & PropsWithChildren) => {
  const [frameNumber, setFrameNumber, frameNumberChangeHandler, {name: frameName, tip: frameTip}] =
    useConfigSetting('random.frameNumber');
  const [worldSeed, setWorldSeed, worldSeedChangeHandler, {name: seedName, tip: seedTip}] =
    useConfigSetting('random.worldSeed');

  const usesRandom = useIsRandomUsed();

  return usesRandom ? (
    <GridGroup>
      <EditableWrapper
        dataName={dataName}
        sprite={useSprite('icon.config.die2')}
        tip={seedTip}
        className={className}
        disabled={disabled}
        label={true}
        style={style}
      >
        <WandStatName>{seedName}</WandStatName>
        {children}
        <NumericInput
          smallest={0}
          largest={Number.POSITIVE_INFINITY}
          value={worldSeed}
          setValue={setWorldSeed}
          onChange={worldSeedChangeHandler}
        >
        </NumericInput>
      </EditableWrapper>
      <EditableWrapper
        dataName={dataName}
        sprite={useSprite('icon.config.die2')}
        tip={frameTip}
        className={className}
        disabled={disabled}
        label={true}
        style={style}
      >
        <WandStatName>{frameName}</WandStatName>
        {children}
        <NumericInput
          smallest={0}
          step={1}
          stepButtons={true}
          largest={Number.POSITIVE_INFINITY}
          value={frameNumber}
          setValue={setFrameNumber}
          onChange={frameNumberChangeHandler}
        >
        </NumericInput>
      </EditableWrapper>
    </GridGroup>
  ) : null;
};

export const RandomEditor = styled(_RandomEditor)`
  display: flex;

`;


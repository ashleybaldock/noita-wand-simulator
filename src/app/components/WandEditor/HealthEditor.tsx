import styled from 'styled-components';
import type {CSSProperties, PropsWithChildren} from 'react';
import {useConfigSetting, useIsHealthUsed} from '../../redux';
import {EditableWrapper} from '../Presentation';
import {useSprite} from '../../calc/sprite';
import {WandStatName} from './WandStatName';
import {ABNumericInput} from '../Input';

const StatSep = styled.div.attrs(() => ({children: '/'}))``;


const _HealthEditor = ({
  children,
  style,
  className,
  dataName = 'HealthEditor',
  disabled = false,
}: {
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  dataName?: string;
} & PropsWithChildren) => {
  const [hpValue, setHpValue, changeHpValueHandler, {name, tip}] = useConfigSetting('var_hp');
  const [maxHpValue, setMaxHpValue, changeMaxHpValueHandler, {name: maxHpName, tip: maxHpTip}] = useConfigSetting('var_hp_max');

  const usesHealth = useIsHealthUsed();

  return usesHealth ? (
    <EditableWrapper
      dataName={dataName}
      sprite={useSprite('icon.config.heart2')}
      tip={tip}
      className={className}
      disabled={disabled}
      label={true}
      style={style}
    >
      <WandStatName>{name}<StatSep />{'Max'}</WandStatName>
      {children}
      <ABNumericInput
        smallest={0}
        largest={Number.POSITIVE_INFINITY}
        valueA={hpValue}
        valueB={maxHpValue}
        separator={<StatSep />}
        setValueA={setHpValue}
        setValueB={setMaxHpValue}
        changeHandlerValueA={changeHpValueHandler}
        changeHandlerValueB={changeMaxHpValueHandler}
      >
      </ABNumericInput>
    </EditableWrapper>
  ) : null;
};

export const HealthEditor = styled(_HealthEditor)`
  display: flex;

`;

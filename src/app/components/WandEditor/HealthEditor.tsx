import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import { useConfigSetting, useIsHealthUsed } from '../../redux';
import { EditableWrapper } from '../Presentation';
import { useSprite } from '../../calc/sprite';
import { WandStatName } from './WandStatName';
import { NumericInput } from '../Input';

const StatSep = styled.div.attrs(() => ({children: '/'}))`
`;


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
  const [value, setValue, changeHandler, { name, tip }] = useConfigSetting('var_hp');
  const [maxHpValue, setMaxHpValue, changeMaxHpHandler, { name: maxHpName, tip: maxHpTip }] = useConfigSetting('var_hp_max');

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
      <WandStatName>{name}<StatSep/>max</WandStatName>
      {children}
      <ABNumericInput
        smallest={0}
        largest={Number.POSITIVE_INFINITY}
        valueMin={hpValue}
        valueMax={maxHpValue}
        separator={<StatSep/>}
        setValueMin={setHpValue}
        setValueMax={setMaxHpValue}
        onChangeMin={changeHpHandler}
        onChangeMax={changeMaxHpHandler}
      >
      </ABNumericInput>
    </EditableWrapper>
  ) : null;
};

export const HealthEditor = styled(_HealthEditor)`
  display: flex;

`;

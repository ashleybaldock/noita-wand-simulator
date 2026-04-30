import styled from 'styled-components';
import type {CSSProperties, PropsWithChildren} from 'react';
import {useConfigSetting, useIsGoldUsed} from '../../redux';
import {EditableWrapper} from '../Presentation';
import {useSprite} from '../../calc/sprite';
import {WandStatName} from './WandStatName';
import {NumericInput} from '../Input';


const _GoldEditor = ({
  children,
  style,
  className,
  dataName = 'GoldEditor',
  disabled = false,
}: {
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  dataName?: string;
} & PropsWithChildren) => {
  const [value, setValue, changeHandler, {name, tip}] = useConfigSetting('var_money');

  const usesGold = useIsGoldUsed();

  return usesGold ? (
    <EditableWrapper
      dataName={dataName}
      sprite={useSprite('icon.config.goldnugget2')}
      tip={tip}
      className={className}
      disabled={disabled}
      label={true}
      style={style}
    >
      <WandStatName>{name}</WandStatName>
      {children}
      <NumericInput
        smallest={0}
        largest={Number.POSITIVE_INFINITY}
        value={value}
        setValue={setValue}
        onChange={changeHandler}
      >
      </NumericInput>
    </EditableWrapper>
  ) : null;
};

export const GoldEditor = styled(_GoldEditor)`
  display: flex;
`;

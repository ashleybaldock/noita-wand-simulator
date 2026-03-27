import type { CSSProperties } from 'react';
import type { DataAttributes } from 'styled-components';

export type UsualAttrs = DataAttributes & {
  style?: CSSProperties;
  className?: string;
  dataName?: string;
};

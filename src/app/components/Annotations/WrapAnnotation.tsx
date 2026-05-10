import styled from 'styled-components';
import { useConfig } from '../../redux';
import type { SpellDeckInfo } from '../../calc/spell';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)`
  pointer-events: none;
  position: absolute;
  bottom: -12px;
  left: 20px;
  z-index: var(--zindex-note-deckidx);
  color: rgb(0 255 0);
  font-size: 14px;
  font-family: var(--font-family-noita-default);
  font-weight: normal;
  --shadow-bg: rgb(0 0 0);
  --shadow-w: 0px;
  text-shadow:
    var(--shadow-bg) 1px 1px var(--shadow-w),
    var(--shadow-bg) 1px -1px var(--shadow-w),
    var(--shadow-bg) -1px 1px var(--shadow-w),
    var(--shadow-bg) -1px -1px var(--shadow-w),
    var(--shadow-bg) 1px 1px 1px,
    var(--shadow-bg) 1px -1px 1px,
    var(--shadow-bg) -1px 1px 1px,
    var(--shadow-bg) -1px -1px 1px;
`;

export const WrapAnnotation = ({
  wasLastToBeCalledBeforeWrapNr,
}: {
  wasLastToBeDrawnBeforeWrapNr?: number;
  wasLastToBeCalledBeforeWrapNr?: number;
  wrappingInto?: readonly SpellDeckInfo[];
}) => {
  const { showWraps } = useConfig();

  return showWraps ? (
    <StyledBaseAnnotation data-name="Wrapped">
      {wasLastToBeCalledBeforeWrapNr}
    </StyledBaseAnnotation>
  ) : null;
};

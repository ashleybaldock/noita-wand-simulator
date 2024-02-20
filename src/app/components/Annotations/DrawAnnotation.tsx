import styled from 'styled-components';
import { useConfig } from '../../redux';

const Wrapped = styled.div`
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
  text-shadow: var(--shadow-bg) 1px 1px var(--shadow-w),
    var(--shadow-bg) 1px -1px var(--shadow-w),
    var(--shadow-bg) -1px 1px var(--shadow-w),
    var(--shadow-bg) -1px -1px var(--shadow-w), var(--shadow-bg) 1px 1px 1px,
    var(--shadow-bg) 1px -1px 1px, var(--shadow-bg) -1px 1px 1px,
    var(--shadow-bg) -1px -1px 1px;
`;

export const DrawAnnotation = ({
  drawBefore = 0,
  drawAfter = 0,
}: {
  drawBefore?: number;
  drawAfter?: number;
}) => {
  const { showDraw } = useConfig();

  if (!showDraw) {
    return null;
  }

  const delta = drawAfter - drawBefore;

  return (
    <Wrapped data-name="DrawAnnotation">{`${drawBefore} >> Draw(${
      delta > 0 ? `-1|+${delta}` : delta < 0 ? `-${delta}|+0` : `-1|+1`
    }) >> ${drawAfter}`}</Wrapped>
  );
};

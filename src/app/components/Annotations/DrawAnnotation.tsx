import styled from 'styled-components';
import { useConfig } from '../../redux';

const DrawAnnotation = styled.div`
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

export const DrawAnnotationConsumed = styled.div``;
export const DrawAnnotationDraws = styled.div``;

export const DrawAnnotations = ({
  draws = 0,
  eats = 1,
}: {
  draws: number;
  eats: number;
}) => {
  const { showDraw } = useConfig();

  if (!showDraw) {
    return null;
  }

  return (
    <>
      <DrawAnnotationConsumed data-name="draw-down">
        {eats}
      </DrawAnnotationConsumed>
      <DrawAnnotationDraws data-name="draw-up">{draws}</DrawAnnotationDraws>
    </>
  );
};

import styled from 'styled-components';

const Wrapped = styled.div`
  pointer-events: none;
  position: absolute;
  bottom: -12px;
  right: 20px;
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

export const AlwaysCastAnnotation = ({
  permanently_attached = false,
}: {
  permanently_attached?: boolean;
}) => {
  if (!permanently_attached) {
    return null;
  }

  return <Wrapped data-name="AlwaysCastAnnotation">{'AC'}</Wrapped>;
};
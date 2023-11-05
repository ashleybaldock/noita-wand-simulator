import styled from 'styled-components/macro';
import { useConfig } from '../../redux';

const Base = styled.div`
  position: absolute;
  top: 5px;
  left: 7px;

  z-index: var(--zindex-note-charges);
  opacity: 0.8;

  image-rendering: pixelated;
  pointer-events: none;

  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center center;
`;

const Zero = styled(Base)`
  width: 9px;
  height: 18px;

  background-image: url('/data/inventory/0charges.png');
`;

const Infinite = styled(Base)`
  width: 18px;
  height: 10px;

  background-image: url('/data/inventory/infcharges.png');
`;

export const ChargesRemainingAnnotation = ({
  charges,
  nounlimited,
}: {
  charges: number | undefined;
  nounlimited: boolean | undefined;
}) => {
  const {
    config: { infiniteSpells },
  } = useConfig();

  return charges === undefined && !nounlimited ? null : infiniteSpells ? (
    <Infinite />
  ) : (
    <Zero />
  );
};

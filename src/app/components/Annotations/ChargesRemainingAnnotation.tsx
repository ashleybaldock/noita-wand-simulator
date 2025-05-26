import styled from 'styled-components';
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
  width: 7px;
  height: 9px;

  background-image: url('/data/inventory/0charges.png');
`;

const Infinite = styled(Base)`
  width: 9px;
  height: 8px;

  background-image: url('/data/inventory/infcharges.png');
`;

const Unlimited = styled(Base)`
  width: 16px;
  height: 16px;

  background-image: url('/data/inventory/unlimitedcharges.png');
`;

const ShouldNotDeplete = styled(Base)`
  width: 11px;
  height: 9px;

  background-image: url('/data/inventory/shouldnotdeplete.png');
`;

const AtLeastOne = styled(Base)`
  width: 7px;
  height: 8px;
  background-image: url('/data/inventory/atleastone.png');
  background-size: cover;
  background-position: top left;
  filter: drop-shadow(2px 0px 0 #000) drop-shadow(-1px 0px 0 #000)
    drop-shadow(0 2px 0 #000) drop-shadow(0 -1px 0 #000);
`;

export const ChargesRemainingAnnotation = ({
  charges,
  neverUnlimited = false,
  depletedByFiring = true,
  shouldBeZero = false,
  shouldNotDeplete = false,
}: {
  charges: number | undefined;
  shouldBeZero?: boolean;
  neverUnlimited?: boolean;
  depletedByFiring?: boolean;
  shouldNotDeplete?: boolean;
}) => {
  const { infiniteSpells, unlimitedSpells } = useConfig();

  const spellHasChargeLimit = charges !== undefined;

  const spellHasUnlimitedCharges =
    spellHasChargeLimit && !neverUnlimited && unlimitedSpells;

  const spellHasInfiniteCharges = spellHasChargeLimit && infiniteSpells;

  const spellShouldNotDepleteWarning =
    !spellHasUnlimitedCharges && !spellHasInfiniteCharges && depletedByFiring;

  const spellHasZeroCharges = spellHasChargeLimit && charges === 0;

  const spellHasAtLeastOneCharge = spellHasChargeLimit && charges >= 0;

  return spellHasInfiniteCharges ? (
    <Infinite data-name="ChargesAnnotation.Inf" />
  ) : spellHasUnlimitedCharges ? (
    <Unlimited data-name="ChargesAnnotation.Unlim" />
  ) : spellShouldNotDepleteWarning ? (
    <ShouldNotDeplete data-name="ChargesAnnotation.ShouldNotDeplete" />
  ) : spellHasZeroCharges ? (
    <Zero data-name="ChargesAnnotation.Zero" />
  ) : spellHasAtLeastOneCharge ? (
    <AtLeastOne data-name="ChargesAnnotation.AtLeastOne" />
  ) : null;
};

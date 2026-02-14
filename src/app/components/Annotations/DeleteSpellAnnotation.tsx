import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';
import { noop } from '../../util';
import { SpellSlot } from '../Spells/SpellSlot/SpellSlot';

const DeleteButton = styled(BaseAnnotation)`
  --transition-in: var(--transition-hover-in);
  --transition-out: var(--transition-hover-out);
  --transition-props: transform;

  position: absolute;
  top: 2px;
  right: 4px;
  left: unset;
  color: black;

  border-radius: 10%;
  border: 1px solid #cb3c3c;
  background-color: black;

  font-size: 10px;
  text-align: center;
  font-family: var(--font-family-noita-default);
  cursor: pointer;

  image-rendering: pixelated;

  z-index: var(--zindex-note-delete);
  padding: 2px;
  width: 1.7em;
  height: auto;
  aspect-ratio: 1;
  background-image: url('/data/warnings/neutralized.png');
  background-repeat: no-repeat;
  background-size: 13px 13px;
  background-position: center center;

  transform: scale(100%);
  transition: var(--transition-in);
  transition-property: var(--transition-props);

  display: none;
  ${SpellSlot}:hover && {
    display: block;
  }

  &:hover {
    transform: scale(109%);

    transition: var(--transition-out);
    transition-property: var(--transition-props);
  }

  &::after {
    content: '';
    display: flex;
    position: absolute;
    inset: -50% -50% auto auto;
    width: 150%;
    height: 200%;
    pointer-events: all;
  }
  &:hover::after {
    width: 180%;
    height: 200%;
  }
`;

export const DeleteSpellAnnotation = ({
  deleteSpell = noop,
}: {
  deleteSpell?: () => void;
}) => {
  return (
    <DeleteButton
      data-name="DeleteSpellAnnotation"
      onClick={deleteSpell}
    ></DeleteButton>
  );
};

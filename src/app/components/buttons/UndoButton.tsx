import { useAppDispatch } from '../../redux/hooks';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';
import type { Tip } from '../Tooltips/tooltipId';
import styled from 'styled-components';

const _UndoButton = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();

  const undo = () => dispatch(ActionCreators.undo());

  return (
    <Button
      className={className}
      dataName="UndoButton"
      hotkeys={'u, ctrl+z, mod+z'}
      onHotkey={undo}
      tip={{ kind: 'uihint', id: 'undo' } as Tip}
      icon={'icon.undo'}
      imgOnly={'500px'}
      onClick={undo}
    >
      Undo
    </Button>
  );
};

export const UndoButton = styled(_UndoButton)`
  margin-left: 0;
  border-radius: var(--bdr-bl);
  border-width: var(--ou) calc(var(--ou) * 0.5) var(--ou) var(--ou);
  border-color: var(--color-button-border) var(--color-button-border)
    var(--color-button-border) var(--color-button-border);
  border-style: solid solid solid solid;
`;

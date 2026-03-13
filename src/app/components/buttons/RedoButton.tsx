import { useAppDispatch } from '../../redux/hooks';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';
import styled from 'styled-components';
import type { Tip } from '../Tooltips/tooltipId';

const _RedoButton = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();

  const redo = () => dispatch(ActionCreators.redo());

  return (
    <Button
      className={className}
      dataName="RedoButton"
      hotkeys={'r, ctrl+r, shift+mod+z'}
      onHotkey={redo}
      tip={{ kind: 'uihint', id: 'redo' } as Tip}
      icon={'icon.redo'}
      imgOnly={'500px'}
      onClick={redo}
    >
      Redo
    </Button>
  );
};

export const RedoButton = styled(_RedoButton)`
  margin-left: 0;
  border-radius: var(--bdr-br);
  border-width: var(--ou) calc(var(--ou) * 0.5) var(--ou) calc(var(--ou) * 0.5);
  border-color: var(--color-button-border) var(--color-button-border)
    var(--color-button-border) var(--color-button-border);
  border-style: solid;
  grid-column: redo;
`;

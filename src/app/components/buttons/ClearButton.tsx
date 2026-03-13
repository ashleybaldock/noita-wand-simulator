import styled from 'styled-components';
import { useAppDispatch } from '../../redux/hooks';
import { clearSpells } from '../../redux/wandSlice';
import { Button } from '../generic';

const _ClearButton = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={className}
      dataName="ClearButton"
      imgOnly="500px"
      hotkeys={'shift+t'}
      tip={{ kind: 'uihint', id: 'clear' }}
      icon={'icon.clear'}
      onClick={() => dispatch(clearSpells())}
    >
      Clear
    </Button>
  );
};
export const ClearButton = styled(_ClearButton)`
  margin-left: 0;
  border-radius: var(--bdr-bl);
  border-width: var(--ou) calc(var(--ou) * 0.5) var(--ou) var(--ou);
  border-color: var(--color-button-border) var(--color-button-border)
    var(--color-button-border) var(--color-button-border);
  border-style: solid solid solid solid;
`;

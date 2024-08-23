import { useState } from 'react';
import { Button } from '../generic';
import { useHotkeys } from 'react-hotkeys-hook';
import { FindSpell } from '../WandEditor/FindSpell/FindSpell';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  align-content: start;
  border-left-color: #5d5d5d;
`;
export const SearchButton = ({ hotkeys = 'f, `, /' }: { hotkeys?: string }) => {
  const [hidden, setHidden] = useState(true);

  const showFindSpell = () => {
    setHidden(false);
  };

  useHotkeys(
    hotkeys,
    () => {
      showFindSpell();
    },
    { preventDefault: true },
  );
  return (
    <>
      <FindSpell hotkeys={hotkeys} hidden={hidden} setHidden={setHidden} />
      <StyledButton
        hotkeys={hotkeys}
        imgOnly={'600px'}
        icon={'icon.search'}
        onClick={() => showFindSpell()}
      >
        Search
      </StyledButton>
    </>
  );
};

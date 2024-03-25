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
        imgOnly={'mobile'}
        imgDataUrl={
          'data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 512 512%22%3E%3Cpath d=%22M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z%22%3E%3C/path%3E%3C/svg%3E'
        }
        onClick={() => showFindSpell()}
      >
        Search
      </StyledButton>
    </>
  );
};

import { useState } from 'react';
import { Button } from '../generic';
import { useHotkeys } from 'react-hotkeys-hook';
import { FindSpell } from '../WandEditor/FindSpell';
import { useFocus } from '../../hooks/useFocus';

export const SearchButton = () => {
  const [hidden, setHidden] = useState(true);

  const [setFocusRef, setFocus] = useFocus<HTMLInputElement>();

  const showFindSpell = () => {
    setHidden(false);
    setFocus();
  };

  useHotkeys(
    'i, /',
    () => {
      showFindSpell();
    },
    { preventDefault: true },
  );
  return (
    <>
      <Button
        hotkeys={'i, /'}
        imgUrl={'data/search.png'}
        onClick={() => showFindSpell()}
      >
        Search
      </Button>
      <FindSpell
        focusRef={setFocusRef}
        place={'header-right'}
        hidden={hidden}
        hide={() => setHidden(true)}
      />
    </>
  );
};

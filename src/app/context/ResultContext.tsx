import { createContext, useState } from 'react';
import type { ClickWandResult } from '../calc/eval/clickWand';
import type { SpellId } from '../redux/Wand/spellId';
import type { Wand } from '../redux/Wand/wand';
import { defaultWand } from '../redux/Wand/presets';

export type ResultContextState = {
  result: ClickWandResult;
  wandState: {
    spellIds: SpellId[];
    alwaysIds: SpellId[];
    zetaId?: SpellId;
    wand: Wand;
  };
};
const defaultResultState: ResultContextState = {
  result: {
    shots: [],
    reloadTime: undefined,
    endConditions: [],
    elapsedTime: 0,
    wraps: 0,
    shotCount: 0,
    reloadCount: 0,
    refreshCount: 0,
    repeatCount: 0,
  },
  wandState: {
    wand: defaultWand,
    spellIds: [],
    zetaId: null,
    alwaysIds: [],
  },
} as const;

export const ResultContext = createContext(defaultResultState);

export const ResultStateContextProvider = ({
  children,
  debug = false,
}: React.PropsWithChildren<{ debug?: boolean }>) => {
  const [resultState, setResultState] = useState(defaultResultState);

  return (
    <ResultContext.Provider value={resultState}>
      {children}
    </ResultContext.Provider>
  );
};

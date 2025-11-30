import { createContext, useState } from 'react';
import type { SimulationResult } from '../calc/eval/SimulationResult';
import type { SpellId } from '../redux/Wand/spellId';
import type { Wand } from '../redux/Wand/wand';
import { defaultWand } from '../redux/Wand/presets';
import { defaultSimulationStateConfig } from '../calc/eval/InitialStateConfig';

export type ResultContextState = {
  result: SimulationResult;
  wandState: {
    spellIds: SpellId[];
    alwaysIds: SpellId[];
    zetaId?: SpellId;
    wand: Wand;
  };
};
const defaultResultState: ResultContextState = {
  result: {
    simulationRequestId: 0,
    shots: [],
    salvos: [],
    reloadTime: undefined,
    endConditions: [],
    elapsedTime: 0,
    wraps: 0,
    shotCount: 0,
    reloadCount: 0,
    refreshCount: 0,
    repeatCount: 0,
    initialState: defaultSimulationStateConfig,
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

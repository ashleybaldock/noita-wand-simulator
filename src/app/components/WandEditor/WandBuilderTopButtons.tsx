import styled from 'styled-components';
import { ClearButton, RedoButton, ResetButton, UndoButton } from '../buttons';
import { ExportOptions } from '../Export';
import type { UsualAttrs } from '../Types/UsualAttrs';
import type { RefObject } from 'react';

export const _WandBuilderTopButtons = ({
  className,
  style,
  dataName = 'WandBuilderTopButtons',
  wandRef,
  spellsRef,
}: {
  wandRef: RefObject<HTMLDivElement | null>;
  spellsRef: RefObject<HTMLDivElement | null>;
} & UsualAttrs) => {
  return (
    <div className={className} style={style} data-name={dataName}>
      <ExportOptions wandRef={wandRef} spellsRef={spellsRef} />
      <UndoButton />
      <RedoButton />
      <ClearButton />
      <ResetButton />
    </div>
  );
};

export const WandBuilderTopButtons = styled(_WandBuilderTopButtons)`
  display: grid;
  grid-template-columns: [left export-start] auto [export-end] 1fr [ undo-start] auto [undo-end redo-start] auto [redo-end] 1ch [clear-start] auto [clear-end reset-start] auto [reset-end] 1ch [ right];
  grid-template-rows: [top title-start] 1fr [ title-end bottom];
  filter: none;
  background-color: var(--color-base-background);
  padding: 0 0 0.3em 0;
  margin: 0;
  width: 100%;
  grid-column: -2;
  grid-row-end: span 2;
  justify-self: end;

  & > button {
    padding-top: 0.4em;
    padding-bottom: 0.3em;
    border-bottom: none;
  }

  & > ${UndoButton} {
    grid-column: undo;
  }
  & > ${RedoButton} {
    grid-column: redo;
  }
  & > ${ResetButton} {
    grid-column: reset;
  }
  & > ${ClearButton} {
    grid-column: clear;
  }

  @media screen and (max-width: 500px) {
    height: 1.8lh;
    grid-template-columns: [left] 1ch [undo-start] auto [undo-end redo-start] auto [redo-end] 1ch [clear-start] auto [clear-end reset-start] auto [reset-end] 1ch [right];

    & > button {
      background-size: 1.6em;
    }
  }
`;

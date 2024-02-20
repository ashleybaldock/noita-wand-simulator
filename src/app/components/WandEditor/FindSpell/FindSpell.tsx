import styled from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';
import type { MouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { Hotkey } from 'react-hotkeys-hook/dist/types';
import {
  insertSpellAfterCursor,
  insertSpellBeforeCursor,
} from '../../../redux/editorThunks';
import { mergeRefs } from '../../../util/mergeRefs';
import type { Spell } from '../../../calc/spell';
import { SearchResultList } from '../FindSpell/SearchResultList';
import { noop } from '../../../util/util';
import { HotkeyHint } from '../../Tooltips/HotkeyHint';
import { useFocus } from '../../../hooks/useFocus';
import { useAppDispatch } from '../../../redux/hooks';
import { spells } from '../../../calc/spells';
import { translate } from '../../../util/i18n';
import useFuzzySearch from '../../../hooks/useFuzzySearch';
import { spellTypeInfoMap } from '../../../calc/spellTypes';
import { MAX_RESULTS_SHOWN } from '../../../util';

const inKeys = [
  'escape',
  // 'tab',
  'enter',
  'up',
  'down',
  'w',
  // 'shift+tab',
  // 'shift+enter',
] as const;

type InKey = (typeof inKeys)[number];
const inKeySet: Set<InKey> = new Set(inKeys);

const isInKey = (key: string): key is InKey => {
  return (inKeySet as Set<string>).has(key);
};

export type FuzzySearchPlacement = 'page-middle' | 'header-right';

const Wrapper = styled.div`
  display: grid;
  place-items: end center;
`;

const NoQuery = styled.div`
  position: absolute;
  top: 2.4em;
  right: 0;
  justify-content: start;
  flex: 0 0 auto;
  font-size: 0.8em;
  background-color: #0000004f;
  padding: 0.5em 1em;
  border-radius: 50%;
  pointer-events: none;
  &::before {
    content: '... ';
  }
`;

const Container = styled.div`
  --bsize-spell: 40px;

  display: flex;
  flex-direction: column;
  position: relative;

  padding: 0.08em 0 0.08em 0.08em;
  margin: 0;
  max-width: 28vw;
  width: auto;
  min-width: 1em;
  margin-left: auto;
}
`;

const SearchInput = styled.input.attrs({ type: 'text' })`
  flex: 1 1 auto;
  width: 6em;

  padding: 0.3em 0.5em 0.2em 0.5em;
  box-sizing: border-box;

  width: auto;
  min-width: 4em;
  caret-color: var(--color-wand-edit-cursor);
  color: #fff;
  background-color: #222;
  text-align: center;

  font: inherit;
  font-size: 1em;
  line-height: 1;
  font-variant: all-small-caps;
  letter-spacing: 2px;

  outline: none;

  border: 1px solid var(--color-tab-border-active);
  border-radius: 0em 15em 0em 15.1em/12em 54em 0em 54.4em;
  border-style: inset groove;
  border: 1px solid var(--color-tab-border-active);
  border-width: 1px;

  &:focus {
    box-shadow: 0px 0 8px 0px #ff710ab8 inset, 0px 0px 10px 3px #680000;
    background-color: #0a0a0a;
  }

  &::placeholder {
    font-size: 0.66em;
    letter-spacing: 0;
    text-align: left;
    color: #666666;
  }
  &:placeholder-shown {
    color: red;
  }

  &:focus:placeholder-shown {
    color: blue;
  }
`;
export type SearchSpell = {
  spell: Spell;
  name: string;
  description: string;
  id: string;
  type: string;
};

const NO_RESULT = 0;
const FIRST_RESULT = 1;
type ResultNone = typeof NO_RESULT;
type ResultFirst = typeof FIRST_RESULT;
type ResultIndex = ResultNone | ResultFirst | number;

/**
 * Search box
 */
export const FindSpell = ({
  hotkeys,
  hidden,
  setHidden = noop,
  className,
}: {
  hotkeys?: string;
  hidden: boolean;
  className?: string;
  setHidden?: (hidden: boolean) => void;
}) => {
  const dispatch = useAppDispatch();

  // TODO - create index during build
  const spellDataSet: readonly SearchSpell[] = useMemo(
    () =>
      spells.map(
        (spell): SearchSpell => ({
          spell,
          type: spellTypeInfoMap[spell.type].name,
          id: spell.id,
          name: translate(spell.name),
          description: translate(spell.description),
        }),
      ),
    [spells],
  );

  const [selectedResult, setSelectedResult] = useState<ResultIndex>(0);

  const { results, searchValue, setSearchValue } = useFuzzySearch<SearchSpell>({
    dataSet: spellDataSet,
    keys: ['name'], //'description', 'id'],
  });

  const filteredResults = results.slice(0, MAX_RESULTS_SHOWN);

  const resultCount = filteredResults.length;

  const noQuery = resultCount === 0 && searchValue === '';

  const firstResultIsSelected = () => selectedResult <= 0;
  const lastResultIsSelected = () => selectedResult >= resultCount - 1;

  const selectFirstResult = () => setSelectedResult(0);
  const selectLastResult = () => setSelectedResult(resultCount - 1);
  const selectNextResult = () =>
    lastResultIsSelected()
      ? selectFirstResult()
      : setSelectedResult(selectedResult + 1);

  const selectPreviousResult = () =>
    firstResultIsSelected()
      ? selectLastResult()
      : setSelectedResult(selectedResult - 1);

  const insertSpell = (before = true) => {
    before
      ? dispatch(
          insertSpellBeforeCursor({
            spellId: filteredResults[selectedResult].item.spell.id,
          }),
        )
      : dispatch(
          insertSpellAfterCursor({
            spellId: filteredResults[selectedResult].item.spell.id,
          }),
        );
  };

  const selectResult = (n: ResultIndex) => {
    if (n <= resultCount) {
      setSelectedResult(n);
      insertSpell();
    }
  };

  const useHotkeysRef = useHotkeys<HTMLInputElement>(
    inKeys,
    (keyEvent, handler) => {
      // (((highlighted + 1) % resultCount) + resultCount) % resultCount,
      const keyDispatch: Record<
        (typeof inKeys)[number],
        (keyEvent: KeyboardEvent, hotkey: Hotkey) => void
      > = {
        w: (e, { ctrl }) => {
          if (ctrl) {
            e.preventDefault();
            setSearchValue('');
          }
        },
        escape: () => (noQuery ? setHidden(true) : setSearchValue('')),
        enter: (_, { shift, ctrl }) => {
          insertSpell(shift);
          if (ctrl) {
            setSearchValue('');
          }
        },
        up: (e) => {
          e.preventDefault();
          selectPreviousResult();
        },
        down: (e) => {
          e.preventDefault();
          selectNextResult();
        },
        // tab: (e, { shift }) => {
        //   if (shift) {
        //     if (!firstResultIsSelected()) {
        //       e.stopImmediatePropagation();
        //       e.preventDefault();
        //       selectPreviousResult();
        //     }
        //   } else {
        //     if (!lastResultIsSelected()) {
        //       e.stopImmediatePropagation();
        //       e.preventDefault();
        //       selectNextResult();
        //     }
        //   }
        // },
      };
      // console.log(_, handler.keys, handler.shift, handler);

      handler.keys?.forEach(
        (key: string) => isInKey(key) && keyDispatch[key]?.(keyEvent, handler),
      );
    },
    {
      enableOnFormTags: ['INPUT'],
      ignoreModifiers: true,
    },
    [noQuery, resultCount, selectedResult],
  );

  const [inputFocusRef, focusSearchInput, blurSearchInput] =
    useFocus<HTMLInputElement>();
  useEffect(() => (hidden ? blurSearchInput() : focusSearchInput()), [hidden]);

  const preventLossOfFocus = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <>
      <Wrapper className={className}>
        <Container onMouseDown={(e) => !hidden && preventLossOfFocus(e)}>
          <SearchInput
            ref={mergeRefs(useHotkeysRef, inputFocusRef)}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              selectFirstResult();
            }}
            onFocus={() => setHidden(false)}
            onBlur={() => setHidden(true)}
            autoComplete="off"
            autoFocus={true}
            placeholder="spell name/id"
          ></SearchInput>
          {<HotkeyHint hotkeys={hotkeys} position={'below'} />}
          {hidden ? null : noQuery ? (
            <NoQuery>Start typing to see suggestions</NoQuery>
          ) : (
            <SearchResultList
              results={filteredResults}
              highlightIdx={selectedResult}
              onSelectResult={selectResult}
            />
          )}
        </Container>
      </Wrapper>
    </>
  );
};

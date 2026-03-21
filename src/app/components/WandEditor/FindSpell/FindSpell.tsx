import styled from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';
import type { MouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  insertSpellAfterCursor,
  insertSpellBeforeCursor,
} from '../../../redux/editorThunks';
import { mergeRefs } from '../../../util/mergeRefs';
import type { Spell } from '../../../calc/spell';
import { SearchResultList } from '../FindSpell/SearchResultList';
import { noop } from '../../../util/util';
import {
  isNotNull,
  isNotNullOrUndefined,
  isNull,
} from '../../../util/Predicate';
import { HotkeyMultiHint } from '../../Tooltips/HotkeyHint';
import { useFocus } from '../../../hooks/useFocus';
import { useAppDispatch } from '../../../redux/hooks';
import { spells } from '../../../calc/spells';
import { translate } from '../../../util/i18n';
import useFuzzySearch from '../../../hooks/useFuzzySearch';
import { spellTypeInfoMap } from '../../../calc/spellTypes';
import { MAX_RESULTS_SHOWN } from '../../../util';
import type { Hotkey } from 'react-hotkeys-hook/packages/react-hotkeys-hook/dist/types';

const inKeys = [
  'escape',
  // 'tab',
  'enter',
  'up',
  'down',
  'w',
  '/',
  // 'shift+tab',
  // 'shift+enter',
] as const;

type InKey = (typeof inKeys)[number];
const inKeySet: Set<InKey> = new Set(inKeys);

const isInKey = (key: string): key is InKey => {
  return (inKeySet as Set<string>).has(key);
};

export type FuzzySearchPlacement = 'page-middle' | 'header-right';

const NoQuery = styled.div`
  position: absolute;
  inset: 100% 0% auto 0%;
  justify-content: start;
  flex: 0 0 auto;
  font-size: 0.8em;
  background-color: #0c0c0cf2;
  padding: 0.5em 1em;
  margin: 0.4em 0;
  border-radius: 50%;
  pointer-events: none;
  border: 2px solid var(--color-tab-border-active);
  border-radius: 0 0.4em;
  &::before {
    content: '... ';
  }

  @media screen and (max-width: 500px) {
    position: absolute;
    inset: 100% auto auto 50%;
    background-color: #0c0c0cf2;
    text-align: center;
    width: max-content;
    border-radius: 0 0 2px 2px;
    transform: translateX(-50%);
    border: 1px solid var(--color-tab-border-active);
    border-style: inset groove;
  }
`;

const Container = styled.div`
  --bsize-spell: 40px;

  grid-area: search;

  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: end;
  margin: 0;
  width: fit-content;
  flex: 1 1 content;

  @media screen and (max-width: 500px) {
    grid-column: searchinput;
    grid-row: 1;
    visibility: hidden;
  }
`;

const SearchInput = styled.input.attrs({ type: 'text' })`
  flex: 1 1 auto;

  box-sizing: border-box;

  width: 33vw;
  min-width: 10ch;
  max-width: 20ch;
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

  border-style: inset groove;
  border-right-color: transparent;

  align-self: stretch;
  justify-self: stretch;

  padding: 0.1em 0.5em 0.1em 0.5em;
  --bwt: 1px;
  --bwr: 0;
  --bwb: 1px;
  --bwl: 2px;
  border: 0 solid var(--color-button-border);
  border-width: var(--bwt) var(--bwr) var(--bwb) var(--bwl);
  box-shadow: inset -0.5px 0 2px -0.5px #000;
  border-radius: var(--brtl) var(--brtr) var(--brbr) var(--brbl) / var(--brt)
    var(--brr) var(--brb) var(--brl);

  &:focus {
    box-shadow:
      0px 0 8px 0px #ff710ab8 inset,
      0px 0px 10px 3px #680000;
    background-color: #0a0a0a;
  }

  &::placeholder {
    letter-spacing: 0;
    color: #666666;
    font-size: 0.9em;
    text-align: center;
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

export type ResultNone = null;
export type ResultIndex = ResultNone | number;

/**
 * Search box
 */
export const FindSpell = ({
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

  const firstResultIsSelected = () =>
    isNotNull(selectedResult) && selectedResult === 1;

  const lastResultIsSelected = () =>
    isNotNull(selectedResult) && selectedResult === resultCount;

  const selectFirstResult = () => setSelectedResult(1);

  const selectLastResult = () => setSelectedResult(resultCount);

  const selectNextResult = () =>
    isNull(selectedResult) || lastResultIsSelected()
      ? selectFirstResult()
      : setSelectedResult(selectedResult + 1);

  const selectPreviousResult = () =>
    isNull(selectedResult) || firstResultIsSelected()
      ? selectLastResult()
      : setSelectedResult(selectedResult - 1);

  const insertSpell = (before = true) => {
    if (isNull(selectedResult)) {
      return;
    }
    const spellId = filteredResults[selectedResult]?.item?.spell?.id;
    if (isNotNullOrUndefined(spellId)) {
      dispatch(
        (before ? insertSpellBeforeCursor : insertSpellAfterCursor)({
          spellId,
        }),
      );
    }
  };

  const selectResult = (n: ResultIndex) => {
    if (isNotNull(n) && n <= resultCount) {
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
        w: (e) => {
          if (e.ctrlKey) {
            e.preventDefault();
            setSearchValue('');
          }
        },
        escape: () => (noQuery ? setHidden(true) : setSearchValue('')),
        '/': (e) => {
          e.preventDefault();
          setHidden(true);
        },
        enter: (e) => {
          insertSpell(!e.shiftKey);
          if (e.ctrlKey) {
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
    [
      noQuery,
      resultCount,
      setSearchValue,
      setHidden,
      selectPreviousResult,
      selectNextResult,
      selectedResult,
      insertSpell,
    ],
  );

  const [inputFocusRef, focusSearchInput, blurSearchInput] =
    useFocus<HTMLInputElement>();
  useEffect(
    () => (hidden ? blurSearchInput() : focusSearchInput()),
    [hidden, blurSearchInput, focusSearchInput],
  );

  const preventLossOfFocus = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Container
      data-name="FindSpell"
      className={className}
      onMouseDown={(e) => !hidden && preventLossOfFocus(e)}
    >
      <SearchInput
        data-name="SearchInput"
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
        placeholder="spell name"
        enterKeyHint="search"
      ></SearchInput>
      {
        <HotkeyMultiHint
          anchor={'ℹ︎'}
          position={'below'}
          hotkeys={[
            { hotkeys: 'enter', description: 'Insert match at cursor' },
            {
              hotkeys: 'shift+enter',
              description: 'Insert match before cursor',
            },
            { hotkeys: 'ctrl+enter', description: 'Insert and clear match' },
            {
              hotkeys: 'ctrl+shift+enter',
              description: 'Insert before and clear match',
            },
          ]}
        />
      }
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
  );
};

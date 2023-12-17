import { useMemo } from 'react';
import styled from 'styled-components';

const lookup = new Map<string, Key>([
  ['mod', { symbol: '^', text: 'Mod' }],
  ['ctrl', { symbol: '^', text: 'Ctrl' }],
  ['alt', { symbol: '⌥', text: 'Alt' }],
  ['shift', { symbol: '⇧', text: 'Shift' }],
  ['meta', { symbol: '⌘', text: 'Meta' }],
  ['backspace', { symbol: '⌫', text: 'Bksp' }],
  ['tab', { symbol: '⇥', text: 'Tab' }],
  ['clear', { symbol: '⌧', text: 'Clear' }],
  ['enter', { symbol: '⌅', text: 'Enter' }],
  ['return', { symbol: '↵', text: 'Return' }],
  ['esc', { symbol: '⎋', text: 'Esc' }],
  ['escape', { symbol: '⎋', text: 'Esc' }],
  ['space', { symbol: '⎵', text: 'Space' }],
  ['up', { symbol: '↑', text: 'Up' }],
  ['down', { symbol: '↓', text: 'Down' }],
  ['left', { symbol: '←', text: 'Left' }],
  ['right', { symbol: '→', text: 'Right' }],
  ['pageup', { symbol: '⇞', text: 'PgUp' }],
  ['pagedown', { symbol: '⇟', text: 'PgDn' }],
  ['del', { symbol: '⌦', text: 'Del' }],
  ['delete', { symbol: '⌦', text: 'Del' }],
  ['f1', { symbol: 'Fn1', text: 'Fn1' }],
  ['f2', { symbol: 'Fn2', text: 'Fn2' }],
  ['f3', { symbol: 'Fn3', text: 'Fn3' }],
  ['f4', { symbol: 'Fn4', text: 'Fn4' }],
  ['f5', { symbol: 'Fn5', text: 'Fn5' }],
  ['f6', { symbol: 'Fn6', text: 'Fn6' }],
  ['f7', { symbol: 'Fn7', text: 'Fn7' }],
  ['f8', { symbol: 'Fn8', text: 'Fn8' }],
  ['f9', { symbol: 'Fn9', text: 'Fn9' }],
  ['f10', { symbol: 'Fn10', text: 'Fn10' }],
  ['f11', { symbol: 'Fn11', text: 'Fn11' }],
  ['f12', { symbol: 'Fn12', text: 'Fn12' }],
  ['f13', { symbol: 'Fn13', text: 'Fn13' }],
  ['f14', { symbol: 'Fn14', text: 'Fn14' }],
  ['f15', { symbol: 'Fn15', text: 'Fn15' }],
  ['f16', { symbol: 'Fn16', text: 'Fn16' }],
  ['f17', { symbol: 'Fn17', text: 'Fn17' }],
  ['f18', { symbol: 'Fn18', text: 'Fn18' }],
  ['f19', { symbol: 'Fn19', text: 'Fn19' }],
]);

export type HintPosition = 'above' | 'below' | 'ne-corner';

const HotkeyHintBase = styled.div<{ position: HintPosition }>`
  --shadow-offx: 0;
  --shadow-offy: 0;
  --shadow-blur: 0.2em;
  --shadow-spread: 0.1em;
  --shadow-color: var(--color-keyhint-shadow, rgba(0, 0, 0, 0.66));
  --border-color: var(--color-keyhint-border, #ffbf00);

  position: absolute;
  top: unset;
  left: unset;
  right: unset;
  bottom: unset;
  min-width: 0;
  min-height: 0;

  display: var(--display-keyhints);
  flex-direction: column;
  place-content: center;

  color: var(--color-arrow-action);
  font-size: calc(max(12px, 0.9em));
  font-weight: 300;
  text-align: center;
  line-height: 1.3em;

  background-color: black;
  padding: 0.2em 0.2em 0.16em 0.2em;
  border: 0.3em double var(--color-keyhint-border);
  border-radius: 0.44em / 1.2em;
  box-shadow: var(--shadow-offx) var(--shadow-offy) var(--shadow-blur)
    var(--shadow-spread) var(--shadow-color);

  z-index: var(--zindex-keyhint);
  &:hover {
    z-index: var(--zindex-keyhint-hover);
  }

  ${({ position }) => {
    if (position === 'above') {
      return `
  top: -1.3em;
  left: unset;
  right: 6%;
  bottom: unset;
      `;
    }
    if (position === 'below') {
      return `
  top: 74%;
  bottom: unset;
  left: unset;
  right: 6%;
      `;
    }
    if (position === 'ne-corner') {
      return `
  top: -2px;
  left: unset;
  right: 2px;
  bottom: unset;
      `;
    }
  }}
`;

export const HotkeyHint = ({
  hotkeys = '',
  position = 'ne-corner',
}: {
  hotkeys?: string;
  position: HintPosition;
}) => {
  return hotkeys === '' ? null : (
    <HotkeyHintBase position={position}>
      <HotKeyCombos hotkeys={hotkeys}></HotKeyCombos>
    </HotkeyHintBase>
  );
};

const KeyCombo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  ${HotkeyHintBase} && {
    display: none;
  }
  ${HotkeyHintBase} &&:first-child {
    display: flex;
  }
  ${HotkeyHintBase}:hover && {
    display: flex;
  }
`;

const ListSeperator = styled.div`
  display: inline-block;
  color: white;
  height: 1em;
  line-height: 1em;
  font-size: 0.8em;

  &::before {
    content: 'or';
    padding: 0.3em;
    font-size: 0.9em;
    font-family: monospace;
  }
  ${KeyCombo}:first-child &::before {
    display: none;
    visibility: hidden;
  }
  ${HotkeyHintBase}:hover ${KeyCombo}:first-child &::before {
    display: inline-block;
    visibility: hidden;
  }
  ${HotkeyHintBase} ${KeyCombo}:first-child:last-child &::before,
  ${HotkeyHintBase}:hover ${KeyCombo}:first-child:last-child &::before {
    display: none;
    visibility: hidden;
  }
`;

const KeyCap = styled.kbd`
  margin: 0px 0.12em;
  height: 1em;
  line-height: 1em;
  min-width: 0;
  border-bottom: 2px inset #5c5f61;
  border-right: 2px inset #c9ced2;
  border-left: 1px solid #5c5f61;
  border-top: 1px solid white;
  background-color: #a7a7a7;
  color: black;
  font-weight: bold;
  font-family: monospace;
  font-variant: unset;

  background-color: black;
  border: none;
  color: var(--color-arrow-action);
`;

const KeyStroke = styled.div`
  display: inline-flex;
  align-items: center;
`;

const KeyCombinator = styled.div`
  display: inline-block;
  color: white;
  height: 1em;
  line-height: 1em;
  font-size: 0.8em;
  &::after {
    content: '+';
    font-family: monospace;
    padding: 0.1em;
    font-size: 1em;
  }
  ${KeyStroke}:last-child &::after {
    content: unset;
  }
`;

type Key = {
  symbol: string;
  text: string;
};

const HotKeyCombos = ({ hotkeys }: { hotkeys: string }) => {
  const split = useMemo(
    () =>
      hotkeys.split(',').map((hotkey) =>
        hotkey
          .trim()
          .split('+')
          .flatMap(
            (key) => lookup.get(key)?.text ?? key.toUpperCase().split(''),
          ),
      ),
    [hotkeys],
  );

  return (
    <>
      {split.map((combo: string[]) => (
        <KeyCombo key={combo.join('-')}>
          <ListSeperator />
          {combo.map((key: string) => (
            <KeyStroke>
              <KeyCap key={`${combo.join('-')}--${key}`}>{`${key}`}</KeyCap>
              <KeyCombinator />
            </KeyStroke>
          ))}
        </KeyCombo>
      ))}
    </>
  );
};

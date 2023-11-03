import { createContext, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

export type KeyState = {
  shift: boolean;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
};

const defaultKeyState: KeyState = {
  shift: false,
  ctrl: false,
  meta: false,
  alt: false,
};

export const KeyStateContext = createContext(defaultKeyState);

export const KeyStateContextProvider = ({
  children,
  debug = false,
}: React.PropsWithChildren<{ debug?: boolean }>) => {
  const [keyState, setKeyState] = useState(defaultKeyState);

  useEffect(() => {
    const blurListener = (evt: FocusEvent) => {
      console.log(evt);
      setKeyState((keyState) => ({
        ...keyState,
        shift: false,
        ctrl: false,
        alt: false,
        meta: false,
      }));
    };

    window.addEventListener('blur', blurListener);

    return () => document.removeEventListener('blur', blurListener);
  }, []);

  useEffect(() => {
    const keydownListener = (evt: KeyboardEvent) => {
      console.log(evt);
      if (evt.key === 'Shift' || evt.shiftKey) {
        setKeyState((keyState) => ({ ...keyState, shift: true }));
      }
      if (evt.key === 'Control' || evt.ctrlKey) {
        setKeyState((keyState) => ({ ...keyState, ctrl: true }));
      }
      if (evt.key === 'Alt' || evt.altKey) {
        setKeyState((keyState) => ({ ...keyState, alt: true }));
      }
      if (evt.key === 'Meta' || evt.metaKey) {
        setKeyState((keyState) => ({ ...keyState, meta: true }));
      }
    };
    document.addEventListener('keydown', keydownListener);

    return () => document.removeEventListener('keydown', keydownListener);
  }, []);

  useEffect(() => {
    const keyupEventListener = (evt: KeyboardEvent) => {
      console.log(evt);
      setKeyState((keyState) => ({
        ...keyState,
        shift: evt.shiftKey,
        ctrl: evt.ctrlKey,
        alt: evt.altKey,
        meta: evt.metaKey,
      }));
      if (evt.key === 'Shift') {
        setKeyState((keyState) => ({ ...keyState, shift: false }));
      }
      if (evt.key === 'Control') {
        setKeyState((keyState) => ({ ...keyState, ctrl: false }));
      }
      if (evt.key === 'Alt') {
        setKeyState((keyState) => ({ ...keyState, alt: false }));
      }
      if (evt.key === 'Meta') {
        setKeyState((keyState) => ({ ...keyState, meta: false }));
      }
    };
    document.addEventListener('keyup', keyupEventListener);

    return () => document.removeEventListener('keyup', keyupEventListener);
  }, []);

  return (
    <KeyStateContext.Provider value={keyState}>
      {debug && <DebugKeyState />}
      {children}
    </KeyStateContext.Provider>
  );
};

const KeyStateDebug = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 3px;
`;
const KeyStateKey = styled.span<{ pressed: boolean }>`
  margin: 2px;
  padding: 2px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ pressed }) => (pressed ? 'var(--color-base)' : '#555555')};
  color: ${({ pressed }) => (pressed ? 'var(--color-base)' : '#555555')};
`;

export const DebugKeyState = () => {
  const { shift, ctrl, alt, meta } = useContext(KeyStateContext);

  return (
    <KeyStateDebug>
      <KeyStateKey pressed={shift}>Shift</KeyStateKey>
      <KeyStateKey pressed={ctrl}>Ctrl</KeyStateKey>
      <KeyStateKey pressed={alt}>Alt</KeyStateKey>
      <KeyStateKey pressed={meta}>Meta</KeyStateKey>
    </KeyStateDebug>
  );
};

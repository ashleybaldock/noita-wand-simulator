import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { CloseButton } from './CloseButton';

const BackgroundDiv = styled.div`
  z-index: var(--zindex-modal-window);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-modal-fullscreen-overlay);
  overscroll-behavior: none;
`;

const MainDiv = styled.div`
  --margin: 2em;
  --modal-header-height: 1.5em;

  position: absolute;
  top: var(--margin);
  right: var(--margin);
  bottom: var(--margin);
  left: var(--margin);
  background-color: var(--color-modal-bg);
  color: var(--color-modal-fg);
  max-height: 100%;
  overflow-y: auto;
  box-shadow: -10px 10px 50px #000;
  overscroll-behavior: none;

  @media screen and (max-width: 500px) {
    --margin: 0;
    box-shadow: unset;
    height: 100vh;
    overflow-y: scroll;
  }
`;

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--color-modal-header-bg);
  color: var(--color-modal-header-fg);
  text-align: center;
  justify-content: space-between;
  padding-left: 0.5em;
  padding: 0.5em;
  align-items: baseline;
  font-size: 1.3em;
  justify-content: end;

  @media screen and (max-width: 500px) {
    padding: 0;
    margin: 0;
    justify-content: start;
    font-size: unset;
  }
`;

const TitleDiv = styled.div`
  @media screen and (max-width: 500px) {
    position: sticky;
    top: 0;
    height: var(--modal-header-height);
    justify-content: right;
    line-height: 1;
    font-size: 1.4em;

    background-color: var(--color-modal-bg);
    height: var(--modal-header-height);
    padding-top: 0.4em;
    padding-left: 0.4em;
    position: fixed;
    top: 0;
    text-align: left;
    z-index: var(--zindex-modal-title);
    padding-bottom: 0;
    width: 100%;
  }
`;

const ContentDiv = styled.div`
  padding: 5px;
  padding-top: var(--modal-header-height);
`;

type Props = {
  title: string;
  visible: boolean;
  onClose: () => void;
};

export const Modal = ({
  title,
  visible,
  onClose,
  children,
}: React.PropsWithChildren<Props>) => {
  const handleClose = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (!e || e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [handleClose]);

  if (!visible) {
    return null;
  }

  return (
    <BackgroundDiv onClick={handleClose}>
      <MainDiv>
        <HeaderDiv>
          <TitleDiv>{title}</TitleDiv>
          <CloseButton onClick={handleClose} />
        </HeaderDiv>
        <ContentDiv>{children}</ContentDiv>
      </MainDiv>
    </BackgroundDiv>
  );
};

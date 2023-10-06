import styled from 'styled-components/macro';
import React, { useMemo, useState } from 'react';
import { ProcessingModal } from './ProcessingModal';
import { exportComponentAsPNG } from 'react-component-export-image';
import { useWandState } from '../../redux/wandSlice';
import { hashString } from '../../util/util';

const StyledSpan = styled.span<{ enabled: boolean }>`
  cursor: pointer;
  font-size: 16px;
  margin: 0 2px;
  pointer-events: ${(props) => (props.enabled ? 'inherit' : 'none')};
  opacity: ${(props) => (props.enabled ? 1 : 0.3)};
`;

type Props = {
  targetRef: React.MutableRefObject<any>;
  fileName: string;
  enabled: boolean;
};

export function SaveImageButton(props: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const wandState = useWandState();

  const stateHash = useMemo(() => {
    return Math.abs(hashString(JSON.stringify(wandState))).toString(36);
  }, [wandState]);

  const saveImageHandler = useMemo(
    // https://github.com/niklasvh/html2canvas/issues/1878#issuecomment-739245273
    () => (ref: React.MutableRefObject<any>, fileName: string) => () => {
      if (ref.current) {
        setIsProcessing(true);
        exportComponentAsPNG(ref as any, {
          fileName: `${stateHash}_${fileName}`,
          html2CanvasOptions: {
            backgroundColor: '#000',
            imageTimeout: 0,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
            onclone: (document) => {
              for (const elem of document.getElementsByClassName(
                'saveImageRoot',
              )) {
                (elem as any).style.width = 'fit-content';
                (elem as any).style.overflowX = 'clip';
              }
            },
          },
        })
          .then(() => {
            setIsProcessing(false);
          })
          .catch(() => {
            setIsProcessing(false);
          });
      }
    },
    [stateHash],
  );

  return (
    <>
      <StyledSpan
        onClick={saveImageHandler(props.targetRef, props.fileName)}
        enabled={props.enabled}
      >
        📷
      </StyledSpan>
      <ProcessingModal visible={isProcessing}>Processing...</ProcessingModal>
    </>
  );
}

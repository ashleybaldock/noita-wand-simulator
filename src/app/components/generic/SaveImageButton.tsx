import styled from 'styled-components';
import type React from 'react';
import { useMemo, useState } from 'react';
import { ProcessingModal } from './ProcessingModal';
import { exportComponentAsPNG } from 'react-component-export-image';
import { useWandState } from '../../redux/wandSlice';
import { hashString } from '../../util/util';
import { Button } from './Button';

function _SaveImageButton({
  fileName,
  targetRef,
}: {
  targetRef: React.MutableRefObject<any>;
  fileName: string;
  enabled: boolean;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const wandState = useWandState();

  const stateHash = useMemo(() => {
    return Math.abs(hashString(JSON.stringify(wandState))).toString(36);
  }, [wandState]);

  // const saveImageHandler = useMemo(
  //   // https://github.com/niklasvh/html2canvas/issues/1878#issuecomment-739245273
  //   () => (ref: React.MutableRefObject<any>, fileName: string) => () => {
  //     if (ref.current) {
  //       setIsProcessing(true);
  //       exportComponentAsPNG(ref as any, {
  //         fileName: `${stateHash}_${fileName}`,
  //         html2CanvasOptions: {
  //           backgroundColor: '#000',
  //           imageTimeout: 0,
  //           scrollX: -window.scrollX,
  //           scrollY: -window.scrollY,
  //           windowWidth: document.documentElement.offsetWidth,
  //           windowHeight: document.documentElement.offsetHeight,
  //           onclone: (document) => {
  //             for (const elem of document.getElementsByClassName(
  //               'saveImageRoot',
  //             )) {
  //               (elem as any).style.width = 'fit-content';
  //               (elem as any).style.overflowX = 'clip';
  //             }
  //           },
  //         },
  //       })
  //         .then(() => {
  //           setIsProcessing(false);
  //         })
  //         .catch(() => {
  //           setIsProcessing(false);
  //         });
  //     }
  //   },
  //   [stateHash],
  // );
  return null;
  // return (
  //   <>
  //     <Button
  //       minimal
  //       // onClick={saveImageHandler(targetRef, fileName)}
  //       imgAfter
  //       imgDataUrl={
  //         'data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 640 512%22%3E%3C!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d=%22M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z%22%3E%3C/path%3E%3C/svg%3E'
  //       }
  //     >
  //       <span>.PNG</span>
  //     </Button>
  //     <ProcessingModal visible={isProcessing}>Processing...</ProcessingModal>
  //   </>
  // );
}

export const SaveImageButton = styled(_SaveImageButton)`
  display: inline flex;
  display: none;
  align-items: end;
  cursor: pointer;
  vertical-align: baseline;

  margin: 0;

  & span {
    font-size: 0.7em;
  }
`;

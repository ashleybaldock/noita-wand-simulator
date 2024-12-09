import styled from 'styled-components';
import type { MutableRefObject } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { ProcessingModal } from './ProcessingModal';
import { Button } from './Button';
import { toPng } from 'html-to-image';
import type { HotkeyConfig } from '../Tooltips/HotkeyHint';

function _SaveImageButton({
  name,
  fileName,
  targetRef,
  hotkeys,
  className = '',
}: {
  targetRef: MutableRefObject<HTMLDivElement | null>;
  name: string;
  fileName: string;
  enabled: boolean;
  hotkeys?: string | HotkeyConfig;
  className?: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = useCallback(() => {
    if (targetRef.current === null) {
      console.log('SaveImageButton click with no targetRef');
      return;
    }

    setIsProcessing(true);

    toPng(targetRef.current, {
      backgroundColor: '#000',
      style: {
        width: 'fit-content',
        overflowX: 'clip',
      },
      cacheBust: true,
    })
      .then((dataUrl) => {
        console.log(dataUrl);
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.warn(err);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [targetRef]);

  return (
    <>
      <Button
        minimal
        onClick={() => handleClick()}
        imgAfter
        icon={'icon.download.png'}
        hotkeys={hotkeys}
        className={className}
      >
        <span>.PNG</span>
      </Button>
      <ProcessingModal visible={isProcessing}>Processing...</ProcessingModal>
    </>
  );
}

export const SaveImageButton = styled(_SaveImageButton)`
  cursor: pointer;
`;

// const stateHash = useMemo(() => {
//   return Math.abs(hashString(JSON.stringify(wandState))).toString(36);
// }, [wandState]);
// const saveImageHandler = useMemo(
//   // https://github.com/niklasvh/html2canvas/issues/1878#issuecomment-739245273
//   () => (ref: React.MutableRefObject<any>, fileName: string) => () => {
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
// return null;

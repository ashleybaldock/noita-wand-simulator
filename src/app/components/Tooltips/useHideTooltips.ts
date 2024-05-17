import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import type { TooltipRefProps } from 'react-tooltip';

export const useHideTooltips = () => {
  const [{ isDraggingAction, isDraggingSelect }] = useDrop(
    () => ({
      accept: 'none',
      collect: (monitor) => ({
        isDraggingAction: monitor.getItemType() === 'spell',
        isDraggingSelect: monitor.getItemType() === 'select',
      }),
    }),
    [],
  );
  const tooltipRef = useRef<TooltipRefProps>(null);

  return [isDraggingAction || isDraggingSelect, tooltipRef] as const;
};

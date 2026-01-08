import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  PointerTransition,
  TouchTransition,
  type MultiBackendOptions,
} from 'react-dnd-multi-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

export const HTML5toTouchPreview: MultiBackendOptions = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      preview: true,
      transition: PointerTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

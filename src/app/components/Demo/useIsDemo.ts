import { useContext } from 'react';
import { DemoContext } from './DemoContext';

export const useIsDemo = () => useContext(DemoContext);

import { createContext, type PropsWithChildren } from 'react';

export const DemoContext = createContext(false);

export const Demo = ({ children }: PropsWithChildren) => (
  <DemoContext value={true}>{children}</DemoContext>
);

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHotkeys } from 'react-hotkeys-hook';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { WandSimulator } from './components/WandSimulator';
import { useReleaseInfo } from './util/useVersion';
import { KeyStateContextProvider } from './context/KeyStateContext';
import { GlobalStyle } from './RootCSSVars';

export function App() {
  const { isRelease, branch, hash } = useReleaseInfo();
  const [showKeyHints, setShowKeyHints] = useState(false);

  useHotkeys('h', () => setShowKeyHints((showing) => !showing));

  return (
    <Provider store={store}>
      <KeyStateContextProvider debug={true}>
        <GlobalStyle keyHints={showKeyHints} />
        {!isRelease && (
          <Helmet>
            <link rel="icon" href="/favicon-dev.ico" />
            <link rel="apple-touch-icon" href="/logo192-dev.png" />
            <link rel="manifest" href="/manifest-dev.json" />
            <title>{`Wand Simulator (${branch}:${hash})}`}</title>
          </Helmet>
        )}
        <WandSimulator />
      </KeyStateContextProvider>
    </Provider>
  );
}

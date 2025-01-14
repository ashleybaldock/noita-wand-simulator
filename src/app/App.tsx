import React from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { WandSimulator } from './components/WandSimulator';
import { useReleaseInfo } from './util/useVersion';
import { GlobalStyle } from './RootCSSVars';

export function App() {
  const { isRelease, branch, hash } = useReleaseInfo();

  return (
    <Provider store={store}>
      <GlobalStyle />
      {!isRelease && (
        <Helmet>
          <link rel="icon" href="/favicon-dev.ico" />
          <link rel="apple-touch-icon" href="/logo192-dev.png" />
          <link rel="manifest" href="/manifest-dev.json" />
          <title>{`Wand Simulator (${branch}:${hash})}`}</title>
        </Helmet>
      )}
      <WandSimulator />
    </Provider>
  );
}

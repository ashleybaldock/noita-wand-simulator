import { StyleSheetManager } from 'styled-components';
import { shouldForwardProp } from './shouldForwardProp';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { WandSimulator } from './components/WandSimulator';
import { useReleaseInfo } from './util/useVersion';
import { KeyStateContextProvider } from './context/KeyStateContext';
import { GlobalStyle } from './RootCSSVars';
import { URLSearchUpdater } from './components/URLSearchUpdater';

export function App() {
  const { isRelease, branch, hash } = useReleaseInfo();

  return (
    <Provider store={store}>
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <HelmetProvider>
          <KeyStateContextProvider debug={true}>
            <URLSearchUpdater />
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
          </KeyStateContextProvider>
        </HelmetProvider>
      </StyleSheetManager>
    </Provider>
  );
}

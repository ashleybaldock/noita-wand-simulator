import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { WandSimulator } from './components/WandSimulator';

function App() {
  return (
    <Provider store={store}>
      <WandSimulator />
    </Provider>
  );
}

export default App;

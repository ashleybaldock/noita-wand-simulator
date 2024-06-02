import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/calc/__generated__/main/spellSprites.css';
import './app/calc/__generated__/main/sprites.css';
import './app/calc/extraSpells/extraSpellSprites.css';
import './index.css';
import './fonts/NoitaPixel.ttf';
import './fonts/NoitaGlyphScaled.ttf';
import { App } from './app/App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
if (rootElement !== null) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

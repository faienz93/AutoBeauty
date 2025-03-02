import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css'
import App from './App.tsx';

import { Capacitor } from '@capacitor/core';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import { defineCustomElements as pwaElements } from '@ionic/pwa-elements/loader';

pwaElements(window);
customElements.define('jeep-sqlite', JeepSqlite);
const platform = Capacitor.getPlatform();




const rootRender = () => {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(
      <StrictMode>
      <App />
      </StrictMode>
  );
}

if (platform !== "web") {
  rootRender();
} else {
  window.addEventListener('DOMContentLoaded', async () => {
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      customElements.whenDefined('jeep-sqlite').then(() => {
          rootRender();
      })
      .catch ((err) => {
          console.log(`Error: ${err}`);
          throw new Error(`Error: ${err}`)
      });
  });
}

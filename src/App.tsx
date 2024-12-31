import Home from './Home';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
// import './App.css'
import '@ionic/react/css/core.css';

import { setupIonicReact } from '@ionic/react';

setupIonicReact();

function App() {
  
  return (
    <IonApp>
      <Router>
        <IonRouterOutlet>
          <Route exact path="/" component={Home} />
        </IonRouterOutlet>
      </Router>
    </IonApp>
  );
}

export default App

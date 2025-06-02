import { scan } from "react-scan"; 
import React, { memo, useMemo } from 'react';

scan({
  enabled: true,
});

import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';

import { setupIonicReact } from '@ionic/react';

setupIonicReact();
import { Route, Redirect } from 'react-router';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/**
 * Ionic Dark Theme
 * -----------------------------------------------------
 * For more information, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/react/css/palettes/dark.always.css';
// import '@ionic/react/css/palettes/dark.class.css';
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
// import './theme/variables.css';

import { homeOutline, addCircleOutline, listOutline, settingsOutline, speedometerOutline } from 'ionicons/icons';
import './tab.css';
import ListCarMaintenance from './pages/ListCarMaintenance';

import ItemPage from './pages/ItemPage';

import { Capacitor } from '@capacitor/core';



import Setting from './pages/Setting';
import { getEnv } from './services/env';
import KmPage from './pages/KmPage';
import { MaintenanceDbService } from './services/database/MaintenanceDbService';
import { KilometersDbService } from './services/database/LastKmDbService';
import HomePage from "./pages/HomePage";


setupIonicReact({ mode: 'md' });
const envVar = getEnv();

const maintenanceDbInstance = new MaintenanceDbService(envVar?.car_table);
const kilometersDbInstance = new KilometersDbService(envVar?.km_table);

export const platform = Capacitor.getPlatform();
export const MaintenanceDbCtx = React.createContext(new MaintenanceDbService(envVar?.car_table));
export const KilometersDbCtx = React.createContext(new KilometersDbService(envVar?.km_table));

const Tab = memo(() => (
  <IonReactRouter>
  <IonTabs>
    <IonRouterOutlet>
      <Redirect exact path="/" to="/home" />
      <Route path="/home" render={() => <HomePage />} exact={true} />
      <Route path="/newItem" render={() => <ItemPage />} exact={true} />
      <Route path="/newItem/edit/:id" render={() => <ItemPage />} exact={true} />
      <Route path="/list" render={() => <ListCarMaintenance />} exact={true} />
      <Route path="/newkm" render={() => <KmPage />} exact={true} />
      <Route path="/newkm/edit/:id" render={() => <KmPage />} exact={true} />
      <Route path="/settings" render={() => <Setting />} exact={true} />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/home">
        <IonIcon icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="list" href="/list">
        <IonIcon icon={listOutline} />
        <IonLabel>List</IonLabel>
      </IonTabButton>

      <IonTabButton tab="newItem" href="/newItem">
        <IonIcon icon={addCircleOutline} />
        <IonLabel>Add</IonLabel>
      </IonTabButton>

      <IonTabButton tab="newkm" href="/newkm">
        <IonIcon icon={speedometerOutline} />
        <IonLabel>KM</IonLabel>
      </IonTabButton>

      <IonTabButton tab="settings" href="/settings">
        <IonIcon icon={settingsOutline} />
        <IonLabel>Setting</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
</IonReactRouter>
))

function App() {

  // Usa useMemo per assicurarti che i valori del context non cambino ad ogni render
  const maintenanceDbValue = useMemo(() => maintenanceDbInstance, []);
  const kilometersDbValue = useMemo(() => kilometersDbInstance, []);

  return (

    <MaintenanceDbCtx.Provider value={maintenanceDbValue}>
      <KilometersDbCtx.Provider value={kilometersDbValue}>  
        <Tab />
      </KilometersDbCtx.Provider>
    </MaintenanceDbCtx.Provider>


  );
}

export default App;

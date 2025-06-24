import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonApp } from '@ionic/react';
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

import { homeOutline, addCircleOutline, listOutline, settingsOutline, speedometerOutline, informationOutline } from 'ionicons/icons';
import './tab.css';
import ListCarMaintenance from './pages/ListCarMaintenance';

import ItemPage from './pages/ItemPage';

import { Capacitor } from '@capacitor/core';



import Setting from './pages/Setting';
import KmPage from './pages/KmPage';

import HomePage from "./pages/HomePage";
import { DatabaseProvider } from "./services/database/DatabaseProvider";
import InfoPage from './pages/InfoPage';


setupIonicReact({ mode: 'md' });

export const platform = Capacitor.getPlatform();

function App() {
  return (

    <DatabaseProvider>
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Redirect exact path="/" to="/home" />
                <Route path="/home" component={HomePage} exact={true} />
                <Route path="/newItem" component={ItemPage} exact={true} />
                <Route path="/newItem/edit/:id" component={ItemPage} exact={true} />
                <Route path="/list" component={ListCarMaintenance} exact={true} />
                <Route path="/newkm/edit/:id" component={KmPage} exact={true} />
                <Route path="/settings" component={Setting} exact={true} />
                <Route path="/info" component={InfoPage} exact={true} />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>

                <IonTabButton tab="list" href="/list">
                  <IonIcon icon={listOutline} />
                  <IonLabel>Lista</IonLabel>
                </IonTabButton>

                <IonTabButton tab="newItem" href="/newItem">
                  <IonIcon icon={addCircleOutline} />
                  <IonLabel>Aggiungi</IonLabel>
                </IonTabButton>

                <IonTabButton tab="settings" href="/settings">
                  <IonIcon icon={settingsOutline} />
                  <IonLabel>Impostazioni</IonLabel>
                </IonTabButton>

                <IonTabButton tab="info" href="/info">
                  <IonIcon icon={informationOutline} />
                  <IonLabel>Info</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </IonApp>

      </DatabaseProvider>


  );
}

export default App;

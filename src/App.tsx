import React from 'react';
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

import { homeOutline, addCircleOutline, listOutline, add, arrowUpCircleSharp } from 'ionicons/icons';
import './tab.css';
import ListCarMaintenance from './pages/ListCarMaintenance';
import HomePage from './pages/HomePage';
import ItemPage from './pages/ItemPage';
import ImportItem from './pages/ImportItem';
import ProductList from './pages/ProductItem';

import { Capacitor } from '@capacitor/core';
import SqliteService from './services/sqliteService';
import DbVersionService from './services/dbVersionService';
import StorageServiceUser from './services/storageServiceUser';
import AppInitializer from './components/AppInitializer/AppInitializer';
import UsersPage from './pages/UsersPage';

setupIonicReact({ mode: 'md' });

export const platform = Capacitor.getPlatform();

// Singleton Services
export const SqliteServiceContext = React.createContext(SqliteService);
export const DbVersionServiceContext = React.createContext(DbVersionService);
export const StorageServiceContext = React.createContext(new StorageServiceUser(SqliteService, DbVersionService));

function App() {
  return (
    <SqliteServiceContext.Provider value={SqliteService}>
      <DbVersionServiceContext.Provider value={DbVersionService}>
        <StorageServiceContext.Provider value={new StorageServiceUser(SqliteService, DbVersionService)}>
          <AppInitializer>
            <IonReactRouter>
              <IonTabs>
                <IonRouterOutlet>
                  <Redirect exact path="/" to="/home" />
                  <Route path="/home" render={() => <HomePage />} exact={true} />
                  <Route path="/newItem" render={() => <ItemPage />} exact={true} />
                  <Route path="/list" render={() => <ListCarMaintenance />} exact={true} />
                  <Route path="/import" render={() => <ImportItem />} exact={true} />
                  <Route path="/user" render={() => <UsersPage />} exact={true} />
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

                  <IonTabButton tab="import" href="/import">
                    <IonIcon icon={add} />
                    <IonLabel>Import</IonLabel>
                  </IonTabButton>

                  <IonTabButton tab="user" href="/user">
                    <IonIcon icon={arrowUpCircleSharp} />
                    <IonLabel>User</IonLabel>
                  </IonTabButton>
                </IonTabBar>

                
              </IonTabs>
            </IonReactRouter>
          </AppInitializer>
        </StorageServiceContext.Provider>
      </DbVersionServiceContext.Provider>
    </SqliteServiceContext.Provider>
  );
}

export default App;

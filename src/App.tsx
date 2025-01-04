import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';

import { setupIonicReact } from '@ionic/react';

setupIonicReact();
import { Route, Redirect } from 'react-router';

import { homeOutline, addCircleOutline, listOutline } from 'ionicons/icons';
import './tab.css';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import NewItemPage from './pages/NewItemPage';

function App() {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />          
          <Route path="/home" render={() => <HomePage />} exact={true} />
          <Route path="/newItem" render={() => <NewItemPage />} exact={true} />          
          <Route path="/list" render={() => <ListPage />} exact={true} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
          
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          <IonTabButton tab="newItem" href="/newItem">
            <IonIcon icon={addCircleOutline} />
            <IonLabel>Add</IonLabel>
          </IonTabButton>

          <IonTabButton tab="list" href="/list">
            <IonIcon icon={listOutline} />
            <IonLabel>List</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}
export default App;
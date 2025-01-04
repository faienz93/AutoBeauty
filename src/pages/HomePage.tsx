import React from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonToolbar, IonTitle, IonButtons, IonBackButton, IonAvatar, IonIcon } from '@ionic/react';

// import './homepage.css';
import manutenzioneData from '../assets/data.json';

import { homeOutline, addCircleOutline, car } from 'ionicons/icons';
function HomePage() {

  const getMaintenanceIcon = (tipo: string) => {
    switch (tipo) {
      case 'Tagliando':
        return '/public/maintenance.svg';
      case 'Gomme':
        return '/public/tire.svg';
      case 'Revisione':
        return '/public/car-repair.svg';
      default:
        return '/public/car.svg';
    }
  };

  return (
    <>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>List Maintenance</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" fullscreen={true}>
        <IonList inset={true}>
          {manutenzioneData.map((item, index) => (
            <IonItem>
              <IonAvatar slot="start">
              {/* <IonIcon icon={car} size="large"/>                */}
              {/* <IonIcon src="/public/tire.svg" size="large"/>  */}
              <IonIcon src={getMaintenanceIcon(item.tipo)} size="large"/> 
              </IonAvatar>              
              <IonLabel>{item.data}</IonLabel>
              <IonLabel>{item.km}</IonLabel>
              <IonLabel>{item.tipo}</IonLabel>
              <IonLabel>{item.costo}</IonLabel>
              <IonLabel>{item.note || '—'}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>

  );

}


export default HomePage;
import React from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonToolbar, IonTitle, IonButtons, IonBackButton, IonAvatar, IonIcon } from '@ionic/react';

// import './homepage.css';
import maintenanceData from '../data/data.json';
import { Maintenance, MaintenanceType } from '../types/Maintenance';
const maintenance: Maintenance[] = maintenanceData as Maintenance[];


import { homeOutline, addCircleOutline, car } from 'ionicons/icons';
function HomePage() {

  const getMaintenanceIcon = (type: MaintenanceType): string => {
    switch (type) {
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
          {maintenance.map((item, index) => (
            <IonItem>
              <IonAvatar slot="start">
              {/* <IonIcon icon={car} size="large"/>                */}
              {/* <IonIcon src="/public/tire.svg" size="large"/>  */}
              <IonIcon src={getMaintenanceIcon(item.type)} size="large"/> 
              </IonAvatar>              
              <IonLabel>{item.data}</IonLabel>
              <IonLabel>{item.km}</IonLabel>
              <IonLabel>{item.type}</IonLabel>
              <IonLabel>{item.expense}</IonLabel>
              <IonLabel>{item.note || '—'}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>

  );

}


export default HomePage;
import React from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonToolbar, IonTitle, IonButtons, IonBackButton, IonAvatar, IonIcon } from '@ionic/react';

// import './homepage.css';
import maintenanceData from '../data/data.json';
import { Maintenance, MaintenanceType } from '../types/Maintenance';
const maintenance: Maintenance[] = maintenanceData as Maintenance[];


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
            <IonItem key={index}>
              <IonAvatar slot="start">
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
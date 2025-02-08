import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonToolbar, IonTitle, IonButtons, IonBackButton, IonAvatar, IonIcon } from '@ionic/react';

// import './homepage.css';
import tagliandoImg from '../assets/maintenance.svg';
import tireImg from '../assets/tire.svg';
import repairImg from '../assets/car-repair.svg';
import carImg from '../assets/car.svg';
import { Maintenance, MaintenanceType } from '../types/Maintenance';



import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';




function HomePage() {

  // All'interno del tuo componente:
const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

const fetchMaintenances = async () => {
  const querySnapshot = await getDocs(collection(db, 'maintenances'));
  const data = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Maintenance)
  }));
  setMaintenances(data);
};

useEffect(() => {
  fetchMaintenances();

  console.log(maintenances)
}, []);

  const getMaintenanceIcon = (type: MaintenanceType): string => {
    switch (type) {
      case 'Tagliando':
        return tagliandoImg;
      case 'Gomme':
        return tireImg;
      case 'Revisione':
        return repairImg;
      default:
        return carImg;
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
          {maintenances.map((item, index) => (
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
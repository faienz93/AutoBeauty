import React from 'react';
import { useState } from 'react';
import { Maintenance, MaintenanceType } from '../types/Maintenance';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonCard } from '@ionic/react';
import { IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Header } from './Header';
import { getEnv } from '../services/env';

const envVar = getEnv();

const HomePage = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const today = new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const fetchMaintenances = async () => {
    const querySnapshot = await getDocs(collection(db, envVar?.collection));
    const data = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Maintenance),
    }));
    setMaintenances(data);
  };
  return (
    <>
      <Header title="Home" showBackButton={false} />
      <IonContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            // flex: 1,
            height: '100%',
          }}>
          
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Data odierna</IonCardTitle>
              <IonCardSubtitle>{today}</IonCardSubtitle>
            </IonCardHeader>

            
          </IonCard>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>KM Attuali</IonCardTitle>
              <IonCardSubtitle>28/12/2024</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>Da Fare</IonCardContent>
          </IonCard>
          <IonCard color="success">
            <IonCardHeader>
              <IonCardTitle>Ultimo tagliando</IonCardTitle>
              <IonCardSubtitle>27/12/2024</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>Da non fare</IonCardContent>
          </IonCard>
          <IonCard color="danger">
            <IonCardHeader>
              <IonCardTitle> Ultimo intervento Gomme</IonCardTitle>
              <IonCardSubtitle>30/10/2024</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>Da non fare.</IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </>
  );
};

export default HomePage;

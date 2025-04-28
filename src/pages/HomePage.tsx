import React, { useEffect } from 'react';
import { useState } from 'react';
import { Maintenance, MaintenanceType } from '../models/Maintenance';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonCard, IonText } from '@ionic/react';
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

  useEffect(() => {
    fetchMaintenances();

    console.log(maintenances);
  }, []);
  return (
    <>
      <Header title="Home" showBackButton={false} />
      <IonContent fullscreen={true}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}>
          <IonCard style={{ flexGrow: 1 }}>
            <IonCardHeader>
              <IonCardTitle>Data odierna</IonCardTitle>
              <IonCardSubtitle>{today}</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        </div>

        {maintenances.length == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}>
            <IonCard style={{ flexGrow: 1 }}>
              <IonCardHeader>
                <IonCardTitle>KM Attuali</IonCardTitle>
                <IonCardSubtitle>28/12/2024</IonCardSubtitle>
              </IonCardHeader>
            </IonCard>

            <IonCard color="success" style={{ flexGrow: 1 }}>
              <IonCardHeader>
                <IonCardTitle>Tagliando</IonCardTitle>
                <IonCardSubtitle>27/12/2024</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>Da non fare</IonCardContent>
            </IonCard>
            <IonCard color="danger" style={{ flexGrow: 1 }}>
              <IonCardHeader>
                <IonCardTitle> Gomme</IonCardTitle>
                <IonCardSubtitle>30/10/2024</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>DA FARE</IonCardContent>
            </IonCard>
            <IonCard color="danger" style={{ flexGrow: 1 }}>
              <IonCardHeader>
                <IonCardTitle> Revisione</IonCardTitle>
                <IonCardSubtitle>30/10/2024</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>DA FARE</IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </>
  );
};

export default HomePage;

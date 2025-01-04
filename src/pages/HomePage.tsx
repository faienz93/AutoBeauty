import React from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';

// import './homepage.css';
import manutenzioneData from '../assets/data.json';


function HomePage() {

  // const getRowClass = (tipo: string) => {
  //   switch (tipo) {
  //     case 'Tagliando':
  //       return 'tagliando';
  //     case 'Gomme':
  //       return 'gomme';
  //     case 'Revisione':
  //       return 'revisione';
  //     default:
  //       return '';
  //   }
  // };

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
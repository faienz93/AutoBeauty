import React from 'react';
import { IonContent, IonItem, IonLabel, IonList } from '@ionic/react';

// import './homepage.css';
const manutenzioneData = [
  { data: '21/08/19', km: 62000, tipo: 'Tagliando', costo: '€ 50,00', note: 'Cambio gomme + convergenza' },
  { data: '09/04/21', km: 74000, tipo: 'Gomme', costo: '€ 420,00', note: '' },
  { data: '15/05/21', km: 76488, tipo: 'Revisione', costo: '€ 80,00', note: 'Prossima 05/2023' },
  { data: '10/08/21', km: 81000, tipo: 'Tagliando', costo: '€ 50,00', note: '' },
  { data: '06/01/22', km: 83938, tipo: 'Gomme', costo: '€ 30,00', note: 'Inversione gomme' }
];


function HomePage() {

  const getRowClass = (tipo: string) => {
    switch (tipo) {
      case 'Tagliando':
        return 'tagliando';
      case 'Gomme':
        return 'gomme';
      case 'Revisione':
        return 'revisione';
      default:
        return '';
    }
  };

  return (
    <IonContent color="light">
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
  );

}


export default HomePage;
import React from 'react';
import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import './homepage.css';
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
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Storico Manutenzione Auto</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow className="header-row">
            <IonCol size="2"><strong>Data</strong></IonCol>
            <IonCol size="2"><strong>Al KM</strong></IonCol>
            <IonCol size="2"><strong>Tipo</strong></IonCol>
            <IonCol size="2"><strong>Costo (€)</strong></IonCol>
            <IonCol size="4"><strong>Note</strong></IonCol>
          </IonRow>

          {manutenzioneData.map((item, index) => (
            <IonRow key={index} className={getRowClass(item.tipo)}>
              <IonCol size="2">{item.data}</IonCol>
              <IonCol size="2">{item.km}</IonCol>
              <IonCol size="2">{item.tipo}</IonCol>
              <IonCol size="2">{item.costo}</IonCol>
              <IonCol size="4">{item.note || '—'}</IonCol>
            </IonRow>
          ))}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );

}


export default HomePage;
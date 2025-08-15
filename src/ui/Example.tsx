import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonThumbnail } from '@ionic/react';
import tagliandoImg from '../assets/engine-oil.png';
import './Example.css';

// https://forum.ionicframework.com/t/ion-card-design-weather-card/135329
export const Example = () => {
  return (
    <>
      <IonCard color="light" className="my-ion-card" maintenance-state="ok">
        <IonCardHeader>
          <IonCardTitle className="my-ion-card-title">Revisione</IonCardTitle>
          <IonCardSubtitle className="my-ion-card-subtitle">10 mag 2025</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent className="my-ion-card-content">
          {/* <IonThumbnail slot="start" style={{ fontSize: 38, color: 'var(--ion-color-medium)' }}> */}
          <IonThumbnail slot="start" className="my-ion-thumbnail">
            <img src={tagliandoImg as string} alt={tagliandoImg || ''} />
          </IonThumbnail>
          <span>Km: 107223</span>
          <span>Prossima Tra 5 mesi</span>
          <span>Tutto sotto controllo</span>
        </IonCardContent>
      </IonCard>
    </>
  );
};

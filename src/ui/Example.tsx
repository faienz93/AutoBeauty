import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonThumbnail } from '@ionic/react';
import tagliandoImg from '../assets/engine-oil.png';
import carMaintenanceImg from '../assets/car-maintenance-unsplash.jpg';
import './Example.css';
import { checkmarkDoneCircle, closeCircle } from 'ionicons/icons';

// https://forum.ionicframework.com/t/ion-card-design-weather-card/135329
export const Example = () => {
  const choice = ['urgent', 'ok'];
  const randomIndex = Math.floor(Math.random() * choice.length);
  const randomElement = choice[randomIndex];
  console.log(randomElement);
  return (
    <>
      <IonCard color="light" className="my-ion-card" maintenance-state={randomElement} onClick={() => alert(randomElement)}>
        {/* <IonIcon
          icon={informationCircleOutline}
          className="header-icon"
          onClick={(e) => {
            e.stopPropagation(); // Non triggerare il click della card
            // showInfo();
          }}
        /> */}

        <IonThumbnail className="header-icon">
          <img src={tagliandoImg as string} alt={tagliandoImg || ''} />
        </IonThumbnail>
        <IonCardHeader>
          <IonCardTitle className="my-ion-card-title">Revisione</IonCardTitle>
          <IonCardSubtitle className="my-ion-card-subtitle">10 mag 2025</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent className="my-ion-card-content">
          <IonThumbnail slot="start" className="my-ion-thumbnail">
            <img src={carMaintenanceImg as string} alt={carMaintenanceImg || ''} />
          </IonThumbnail>
          <span>Km: 107223</span>
          <span>Prossima Tra 5 mesi</span>
          <div>
            <IonIcon
              slot="icon-only"
              icon={randomElement === 'urgent' ? closeCircle : checkmarkDoneCircle}
              className="my-ion-icon"
              maintenance-state={randomElement}
            />
            <span maintenance-state={randomElement}>{randomElement === 'urgent' ? 'Da fare' : 'Tutto sotto controllo'}</span>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};

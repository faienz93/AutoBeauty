import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonThumbnail } from '@ionic/react';
import './Example.css';
import { checkmarkDoneCircle, closeCircle } from 'ionicons/icons';

interface CardProps {
  title: string;
  subtitle: string;
  km: string;
  note?: string;
  status?: 'urgent' | 'up-to-date';
  layout: {
    color?: string;
    icon: string;
    backgroundImage: string;
  };
  onEdit(): void;
}

// https://forum.ionicframework.com/t/ion-card-design-weather-card/135329
export const Example: React.FC<CardProps> = ({ title, subtitle, km, note, status, layout: { color = 'light', icon, backgroundImage }, onEdit }) => {
  return (
    <>
      <IonCard color={color} className="my-ion-card" maintenance-state={status} onClick={onEdit}>
        <IonThumbnail className="header-icon">
          <img src={icon as string} alt={icon || ''} />
        </IonThumbnail>
        <IonCardHeader>
          <IonCardTitle className="my-ion-card-title">{title}</IonCardTitle>
          <IonCardSubtitle className="my-ion-card-subtitle">{subtitle}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent className="my-ion-card-content">
          <IonThumbnail slot="start" className="my-ion-thumbnail">
            <img src={backgroundImage} alt={backgroundImage || ''} />
          </IonThumbnail>
          <span>
            <b>KM:</b> {km}
          </span>
          {note && (
            <span>
              <b>Note:</b>
              {note}
            </span>
          )}
          <div>
            <IonIcon slot="icon-only" icon={status === 'urgent' ? closeCircle : checkmarkDoneCircle} className="my-ion-icon" maintenance-state={status} />
            <span maintenance-state={status}>{status === 'urgent' ? 'Da fare' : 'Tutto sotto controllo'}</span>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};

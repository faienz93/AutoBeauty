import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonThumbnail } from '@ionic/react';
import './Card.css';
import { checkmarkDoneCircle, closeCircle } from 'ionicons/icons';

interface CardProps {
  title: string;
  subtitle: string;
  content?: string | React.ReactNode;
  status?: 'urgent' | 'up-to-date';
  layout?: {
    color?: string;
    backgroundImage?: string;
    icon?:
      | { iconImage: string; ionIcon?: undefined } // Solo iconImage
      | { ionIcon: string; iconImage?: undefined } // Solo ionIcon
      | { iconImage?: undefined; ionIcon?: undefined }; // Nessuna icona
  };
  onEdit?(): void;
}

// https://forum.ionicframework.com/t/ion-card-design-weather-card/135329
export const Card: React.FC<CardProps> = ({ title, subtitle, content, status, layout = {}, onEdit }) => {
  const { color, icon: { iconImage, ionIcon } = {}, backgroundImage } = layout;

  const isClickable = !!onEdit;

  return (
    <>
      <IonCard color={color} className="my-ion-card" data-clickable={isClickable ? 'true' : 'false'} maintenance-state={status} onClick={onEdit}>
        {iconImage && (
          <IonThumbnail className="header-icon">
            <img src={iconImage as string} alt={iconImage || ''} />
          </IonThumbnail>
        )}

        {ionIcon && (
          <IonThumbnail className="header-icon">
            <IonIcon icon={ionIcon} style={{ display: 'block', margin: 'auto', width: '100%', height: '100%' }} />
          </IonThumbnail>
        )}

        <IonCardHeader>
          <IonCardTitle className="my-ion-card-title">{title}</IonCardTitle>
          <IonCardSubtitle className="my-ion-card-subtitle">{subtitle}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent className="my-ion-card-content">
          {backgroundImage && (
            <IonThumbnail slot="start" className="my-ion-thumbnail">
              <img src={backgroundImage} alt={backgroundImage || ''} />
            </IonThumbnail>
          )}
          {content}
          {status && (
            <div>
              <IonIcon slot="icon-only" icon={status === 'urgent' ? closeCircle : checkmarkDoneCircle} className="my-ion-icon" maintenance-state={status} />
              <span maintenance-state={status}>{status === 'urgent' ? 'Da fare' : 'Tutto sotto controllo'}</span>
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
};

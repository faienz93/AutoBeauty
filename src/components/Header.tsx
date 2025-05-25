import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  return (
    <IonHeader>
      <IonToolbar>
        {showBackButton ? (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
        ) : null}

        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

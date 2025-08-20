import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { memo } from 'react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export const Header = memo(({ title, showBackButton = true }: HeaderProps) => {
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
});

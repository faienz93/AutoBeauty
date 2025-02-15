import { IonAlert } from "@ionic/react";


export const AlertConfirmation = ({ trigger, isOpen, onClose }: { trigger: string, isOpen: boolean, onClose: () => void }) => {
    console.log("Confirmation")
    return (
      <IonAlert
        isOpen={isOpen} 
        header="Attenzione"
        message="Sei sicuro di voler cancellare la manutenzione?"
        trigger={trigger}
        buttons={[
          {
            text: 'Non sono sicuro',
            role: 'cancel',
            handler: () => {
              console.log('Alert canceled');
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              console.log('Alert confirmed');
              onClose();
            },
          },
        ]}
        onDidDismiss={() => onClose()}></IonAlert>
    );
  };
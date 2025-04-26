import { IonAlert } from "@ionic/react";


export const AlertConfirmation = ({ msg, trigger, isOpen, onClose, onConfirm }: { msg: string, trigger: string, isOpen: boolean, onClose: () => void, onConfirm: () => void }) => {
    console.log("Confirmation")
    return (
      <IonAlert
        isOpen={isOpen} 
        header="Attenzione"
        message= {msg}
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
              onConfirm()
              onClose();
            },
          },
        ]}
        onDidDismiss={() => onClose()}></IonAlert>
    );
  };
import { IonAlert } from '@ionic/react';
import { memo } from 'react';

export const AlertConfirmation = memo(
  ({ msg, trigger, isOpen, onClose, onConfirm }: { msg: string; trigger: string; isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    const buttons = [
      {
        text: 'Non sono sicuro',
        role: 'cancel',
        handler: () => {},
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          onConfirm();
          onClose();
        },
      },
    ];
    return <IonAlert isOpen={isOpen} header="Attenzione" message={msg} trigger={trigger} buttons={buttons} onDidDismiss={() => onClose()}></IonAlert>;
  },
);

import { ReactNode } from 'react';
import { Maintenance } from '../models/MaintenanceType';
import { useHistory } from 'react-router-dom';
import { speedometerOutline } from 'ionicons/icons';
import { Kilometers } from '../models/KilometersType';
import cartImage from '../assets/chad-kirchoff-xe-e69j6-Ds-unsplash.jpg';
import { Card } from '../ui/Card';
import { IonText } from '@ionic/react';

interface LastKmFindedProps {
  // onKmUpdate?: (km: Kilometers) => void;
  lastManualKm: Kilometers;
  maintenanceWithHigherKm: Maintenance;
}

export const LastKmFinded = ({ lastManualKm, maintenanceWithHigherKm }: LastKmFindedProps) => {
  const history = useHistory();

  let content: ReactNode = '';
  if (maintenanceWithHigherKm && lastManualKm.km < maintenanceWithHigherKm.km) {
    const msg = `Attenzione hai impostato un Kilometraggio manuale (${lastManualKm.km} km) che è inferiore al massimo dei km segnati per una manutenzione (${maintenanceWithHigherKm.km} km). Il valore più alto verrà usato nei calcoli.`;
    content = (
      <IonText color="danger" style={{ fontSize: '0.9em', lineHeight: '1.3' }}>
        {msg}
      </IonText>
    );
  }

  // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (lastKm: Kilometers) => {
    history.push({
      pathname: `/newkm/edit/${lastKm._id}`,
    });
  };

  return (
    <>
      <Card
        key={lastManualKm._id}
        cardHeading={cartImage}
        title="Ultimo Kilometro rilevato"
        subtitle={`${lastManualKm.data}`}
        mainNote={`${lastManualKm.km}`}
        comment={content}
        shadowColor="#3355ff"
        iconContent={{
          type: 'icon',
          source: speedometerOutline,
        }}
        onEdit={() => handleEdit(lastManualKm)}
      />
    </>
  );
};

import { Maintenance } from '../models/MaintenanceType';
import { useHistory } from 'react-router-dom';
import { Kilometers } from '../models/KilometersType';
import carRevision from '../assets/car-revision-unsplash.jpg';
import { Card } from '../ui/Card';
import genericCarIcon from '../assets/car.png';
import { ReactNode } from 'react';
import { IonText } from '@ionic/react';

interface LastKmFindedProps {
  // onKmUpdate?: (km: Kilometers) => void;
  lastManualKm: Kilometers;
  maintenanceWithHigherKm: Maintenance;
}

export const LastKmFinded = ({ lastManualKm, maintenanceWithHigherKm }: LastKmFindedProps) => {
  const history = useHistory();

  const isWrongKilometers = maintenanceWithHigherKm && lastManualKm.km < maintenanceWithHigherKm.km;
  const content: ReactNode = (
    <>
      <span>
        <IonText style={{ fontSize: '1.5em', lineHeight: '1.3' }}>KM: {String(lastManualKm.km)}</IonText>
      </span>
      {isWrongKilometers && (
        <IonText style={{ fontSize: '1em', lineHeight: '1.3', display: 'block', color: 'red' }}>
          Attenzione hai impostato un Kilometraggio manuale ({lastManualKm.km} km) che è inferiore al massimo dei km segnati per una manutenzione (
          {maintenanceWithHigherKm.km} km). Il valore più alto verrà usato nei calcoli.
        </IonText>
      )}
    </>
  );

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
        title="Ultimo Kilometro rilevato"
        subtitle={`${lastManualKm.data}`}
        content={content}
        layout={{
          color: isWrongKilometers ? 'warning' : 'secondary',
          icon: genericCarIcon,
          backgroundImage: carRevision,
        }}
        onEdit={() => handleEdit(lastManualKm)}
      />
    </>
  );
};

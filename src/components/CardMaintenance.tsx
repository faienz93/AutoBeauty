import { Maintenance } from '../models/MaintenanceType';
import { useHistory } from 'react-router-dom';
import { useMaintenanceCardIcon } from '../hooks/useMaitenanceCardIcon';
import { Card } from '../ui/Card';
import { isMaintenanceNeeded } from '../utils/carUtils';
import { Example } from '../ui/Example';
import { useMaintenanceCardBackground } from '../hooks/useMaintenanceCardBackground';

export const CardMaintenance = ({ category, maintenance, maxKm }: { category: string; maintenance: Maintenance; maxKm: number }) => {
  const history = useHistory();
  // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (item: Maintenance) => {
    history.push({
      pathname: `/newItem/edit/${item._id}`,
    });
  };

  const diffKm = maxKm - maintenance.km;

  const todo = isMaintenanceNeeded(category, diffKm, maintenance?.data);

  return (
    // <Card
    //   key={maintenance._id}
    //   title={maintenanceType}
    //   subtitle={maintenance?.data || 'N/A'}
    //   mainNote={todo ? 'Da fare' : 'Tutto sotto controllo'}
    //   detailNote={String(maintenance.km)}
    //   comment={maintenance?.note || ''}
    //   shadowColor="#2f3133"
    //   iconContent={{
    //     type: 'image',
    //     source: useMaintenanceIcon(maintenance.tipo),
    //   }}
    //   mainNoteColor={todo ? '#FF0000' : '#008000'}
    //   onEdit={() => handleEdit(maintenance)}
    // />
    <Example
      key={maintenance._id}
      title={category}
      subtitle={maintenance?.data || 'N/A'}
      km={String(maintenance.km)}
      note={maintenance?.note}
      layout={{
        icon: useMaintenanceCardIcon(maintenance.tipo),
        backgroundImage: useMaintenanceCardBackground(maintenance.tipo),
      }}
      status={todo ? 'urgent' : 'up-to-date'}
      onEdit={() => handleEdit(maintenance)}
    />
  );
};

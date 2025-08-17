import { Maintenance } from '../types/MaintenanceType';
import { useHistory } from 'react-router-dom';
import { useMaintenanceCardIcon } from '../hooks/useMaitenanceCardIcon';
import { isMaintenanceNeeded } from '../utils/carUtils';
import { CardMaitenanceDetail } from '../ui/CardMaitenanceDetail';
import { useMaintenanceCardBackground } from '../hooks/useMaintenanceCardBackground';
import { ReactNode } from 'react';

export const CardMaintenance = ({ category, maintenance, maxKm }: { category: string; maintenance: Maintenance; maxKm: number }) => {
  const history = useHistory();
  // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (item: Maintenance) => {
    history.push({
      pathname: `/newItem/edit/${item._id}`,
    });
  };

  const diffKm = maxKm - maintenance.km;

  const km = typeof maintenance.km === 'number' && maintenance.km > 1000 ? maintenance.km.toLocaleString('it-IT') : maintenance.km;

  const content: ReactNode = (
    <>
      <span>
        <b>KM:</b> {String(km)}
      </span>

      <span>
        <b>Note:</b>
        {maintenance?.note ?? ''}
      </span>
    </>
  );

  const todo = isMaintenanceNeeded(category, diffKm, maintenance?.data);

  return (
    <CardMaitenanceDetail
      key={maintenance._id}
      title={category}
      subtitle={maintenance?.data || 'N/A'}
      content={content}
      layout={{
        icon: { iconImage: useMaintenanceCardIcon(maintenance.tipo) },
        backgroundImage: useMaintenanceCardBackground(maintenance.tipo),
      }}
      status={todo ? 'urgent' : 'up-to-date'}
      onEdit={() => handleEdit(maintenance)}
    />
  );
};

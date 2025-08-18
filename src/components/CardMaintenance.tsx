import { Maintenance, MaintenanceWithStatus } from '../types/MaintenanceType';
import { useHistory } from 'react-router-dom';
import { useMaintenanceCardIcon } from '../hooks/useMaitenanceCardIcon';
import { CardMaitenanceDetail } from '../ui/CardMaitenanceDetail';
import { useMaintenanceCardBackground } from '../hooks/useMaintenanceCardBackground';
import { ReactNode } from 'react';

export const CardMaintenance = ({ category, maintenance }: { category: string; maintenance: MaintenanceWithStatus }) => {
  const history = useHistory();
  // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (item: Maintenance) => {
    history.push({
      pathname: `/newItem/edit/${item._id}`,
    });
  };

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
      status={maintenance.isNeeded ? 'urgent' : 'up-to-date'}
      onEdit={() => handleEdit(maintenance)}
    />
  );
};

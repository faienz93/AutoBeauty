import { useContext } from 'react';
import { MaintenanceDbCtx, KilometersDbCtx } from '../services/database/DatabaseProvider';

// Hook personalizzato per il database delle manutenzioni
export const useMaintenanceDb = () => {
  const context = useContext(MaintenanceDbCtx);
  if (!context) {
    throw new Error('useMaintenanceDb must be used within a MaintenanceDbCtx.Provider');
  }
  return context;
};

// Hook personalizzato per il database dei chilometri
export const useKilometersDb = () => {
  const context = useContext(KilometersDbCtx);
  if (!context) {
    throw new Error('useKilometersDb must be used within a KilometersDbCtx.Provider');
  }
  return context;
};
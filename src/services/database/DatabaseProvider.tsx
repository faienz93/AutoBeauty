import React, { useMemo } from 'react';
import { MaintenanceDbService } from './MaintenanceDbService';
import { KilometersDbService } from './LastKmDbService';
import { getEnv } from '../env';
import { KilometersDbCtx, MaintenanceDbCtx } from './databaseContext';

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const envVar = getEnv();

  const maintenanceDb = useMemo(() => new MaintenanceDbService(envVar?.car_table), [envVar?.car_table]);

  const kilometersDb = useMemo(() => new KilometersDbService(envVar?.km_table), [envVar?.km_table]);

  return (
    <MaintenanceDbCtx.Provider value={maintenanceDb}>
      <KilometersDbCtx.Provider value={kilometersDb}>{children}</KilometersDbCtx.Provider>
    </MaintenanceDbCtx.Provider>
  );
};

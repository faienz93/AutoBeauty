import React from 'react';
import { MaintenanceDbService } from './MaintenanceDbService';
import { KilometersDbService } from './LastKmDbService';

export const MaintenanceDbCtx = React.createContext<MaintenanceDbService | null>(null);
export const KilometersDbCtx = React.createContext<KilometersDbService | null>(null);

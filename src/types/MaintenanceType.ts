import { PouchDbType } from './PouchDbType';

export type MaintenanceType = 'Tagliando' | 'Revisione' | 'Gomme';

export interface Maintenance extends PouchDbType {
  data: string;
  km: number;
  costo: number;
  tipo: MaintenanceType;
  note?: string;
}

export const maintenanceTypes: MaintenanceType[] = ['Tagliando', 'Gomme', 'Revisione'];

// export interface Stats {
//   Tagliando?: Maintenance;
//   Gomme?: Maintenance;
//   Revisione?: Maintenance;
//   Chilometraggio?: Maintenance;
// };

export interface MaintenanceWithStatus extends Maintenance {
  isNeeded: boolean;
}

export type Stats = Partial<Record<MaintenanceType, MaintenanceWithStatus>>;

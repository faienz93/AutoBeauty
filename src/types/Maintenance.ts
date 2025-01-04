export type MaintenanceType = 'Tagliando' | 'Revisione' | 'Gomme';

export interface Maintenance {
  data: string;
  km: number;
  type: MaintenanceType;
  expense: string;
  note?: string;
}
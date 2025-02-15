export type MaintenanceType = 'Tagliando' | 'Revisione' | 'Gomme';

export interface Maintenance {
  id: string;
  data: string;
  km: number;
  tipo: MaintenanceType;
  costo: string;
  note?: string;
}
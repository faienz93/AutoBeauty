export type MaintenanceType = 'Tagliando' | 'Revisione' | 'Gomme' | 'Chilometraggio';

export interface Maintenance {
  id: number;
  data: string;
  km: number;
  tipo: MaintenanceType;
  costo: number;
  note?: string;
}

export const maintenanceTypes: MaintenanceType[] = ['Tagliando', 'Gomme', 'Revisione', 'Chilometraggio'];
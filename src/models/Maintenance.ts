export type MaintenanceType = 'Tagliando' | 'Revisione' | 'Gomme' | 'Chilometraggio';

interface PouchDbType {
  _id?: string;
  _rev?: string;
}
export interface Maintenance extends PouchDbType {
  data: string;
  km: number;
  tipo: MaintenanceType;
  costo: number;
  note?: string;
}

export const maintenanceTypes: MaintenanceType[] = ['Tagliando', 'Gomme', 'Revisione', 'Chilometraggio'];
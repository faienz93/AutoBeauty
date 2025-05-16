import { PouchDbType } from "./PouchDbType";

export type MaintenanceType = 'Tagliando' | 'Revisione' | 'Gomme';


export interface Maintenance extends PouchDbType {
  data: string;
  km: number;
  tipo: MaintenanceType;
  costo: number;
  note?: string;
}

export const maintenanceTypes: MaintenanceType[] = ['Tagliando', 'Gomme', 'Revisione'];


export interface Stats {
  Tagliando: Maintenance;
  Gomme: Maintenance;
  Revisione: Maintenance;
  Chilometraggio: Maintenance;
};



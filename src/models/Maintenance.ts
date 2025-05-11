export type MaintenanceType = 'Tagliando' | 'Revisione' | 'Gomme';

export interface PouchDbType {
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

export const maintenanceTypes: MaintenanceType[] = ['Tagliando', 'Gomme', 'Revisione'];


export interface Stats {
  Tagliando: Maintenance;
  Gomme: Maintenance;
  Revisione: Maintenance;
  Chilometraggio: Maintenance;
};



export interface LastKm extends PouchDbType {
  data: string;
  km: number
}
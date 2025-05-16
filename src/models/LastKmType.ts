import { PouchDbType } from "./PouchDbType";


export interface LastKm extends PouchDbType {
  data: string;
  km: number
}
import { PouchDbType } from "./PouchDbType";


export interface Kilometers extends PouchDbType {
  data: string
  km: number
}
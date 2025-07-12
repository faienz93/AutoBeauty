import { useMaintenanceDb } from "./useDbContext";
import { Maintenance } from "../models/MaintenanceType";
import { getMaintenanceKey, parseStringToDate } from "../services/utils";


export const useFetchMaintenances = (): (() => Promise<Maintenance[]>) => {

    const dbMaitenenance = useMaintenanceDb();

    const fetchMaintenances = async (): Promise<Maintenance[]> => {
        const res = await dbMaitenenance.allDocs({ include_docs: true });
        console.log('Fetched docs ----->:', res);
        const maintenance = res.rows.
            filter((value) => {
                // filtra solo i documenti che hanno une specifica chiave
                let key = getMaintenanceKey()
                return value.doc?._id.startsWith(key);
            })
            .map((row: any) => ({
                id: row.doc._id,
                ...row.doc
            }))
            .sort((a: Maintenance, b: Maintenance) => {
                // Ordina per data decrescente
                return new Date(parseStringToDate(b.data)).getTime() - new Date(parseStringToDate(a.data)).getTime();

                // Oppure per km decrescente
                // return b.km - a.km;
            }) as Maintenance[];

        console.log("Vediamo cosa stampiamo")
        console.log(maintenance)

        return maintenance
    };

    return fetchMaintenances;
}
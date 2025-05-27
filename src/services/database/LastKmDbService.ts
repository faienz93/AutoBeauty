import { PouchDbService } from "./pouchDbService";

export class KilometersDbService extends PouchDbService {
    protected async createSpecificIndexes(): Promise<void> {
        if (this.db && this.db.createIndex) {
            try {
                await this.db.createIndex({ index: { fields: ['data'] } });
                await this.db.createIndex({ index: { fields: ['km'], ddoc: "idx-km"} });
            } catch (error) {
                console.warn('Impossibile creare indici PouchDB:', error);
            }
        }
    }

}
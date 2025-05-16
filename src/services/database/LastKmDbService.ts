import { PouchDbService } from "./pouchDbService";

export class LastKmDbService extends PouchDbService {
    protected async createSpecificIndexes(): Promise<void> {
        if (this.db && this.db.createIndex) {
            try {
                await this.db.createIndex({ index: { fields: ['data'] } });
                await this.db.createIndex({ index: { fields: ['km'] } });
                

                // await this.db.createIndex({
                //     index: {
                //         fields: ['km'],
                //         name: 'km-idx'
                //     }
                // });

                // await this.db.createIndex({
                //     index: {
                //         fields: ['tipo', 'data'],
                //         name: 'tipo-data-idx'
                //     }
                // });
            } catch (error) {
                console.warn('Impossibile creare indici PouchDB:', error);
            }
        }
    }

}
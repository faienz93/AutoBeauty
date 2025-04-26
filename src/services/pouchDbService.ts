import { Capacitor } from '@capacitor/core';
import PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
// PouchDB.plugin(cordovaSqlitePlugin);


export interface PouchDbInfo extends PouchDB.Core.DatabaseInfo {
    db_name: string;
    doc_count: number;
    update_seq: number | string;
}


export interface IPouchDbService {    
    getInfo(): Promise<PouchDbInfo>;
    closeDatabase(): Promise<void>;
    deleteDatabase(): Promise<void>;
    // initWebStore(): Promise<void>
    // addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void> 
    // openDatabase(dbName: string, loadToVersion: number, readOnly: boolean): Promise<SQLiteDBConnection> 
    // closeDatabase(dbName: string, readOnly: boolean): Promise<void>
    // saveToStore(dbName: string): Promise<void>
    // saveToLocalDisk(dbName: string): Promise<void>
    // isConnection(dbName: string, readOnly: boolean): Promise<boolean>

    // Operazioni CRUD base (opzionali ma utili)
    // create<T>(dbName: string, doc: T): Promise<PouchDB.Core.Response>;
    // read<T>(dbName: string, id: string): Promise<T>;
    // update<T>(dbName: string, doc: T): Promise<PouchDB.Core.Response>;
    // delete(dbName: string, id: string, rev: string): Promise<PouchDB.Core.Response>;
};

export class PouchDbService implements IPouchDbService {
    
    private platform = Capacitor.getPlatform();
    private db!: PouchDB.Database;

    constructor(dbName: string){
        if (this.platform === 'web') {
            console.log('Web platform detected. Using default PouchDB adapter.');
            this.db = new PouchDB(dbName);
        } else {
            
            console.log('Cordova platform detected. Using cordova-sqlite adapter.');
            this.db = new PouchDB(dbName, {adapter: 'cordova-sqlite'});
        }
    }

    async getInfo(): Promise<PouchDbInfo> {
        try {
            return await this.db.info() as PouchDbInfo;
            
        }catch (error) {
            console.error('Error getting database info:', error);
            throw new Error(`Error getting database info: ${error}`);
        }        
    }

    // Operazioni dirette sul database
    async put(doc: any): Promise<PouchDB.Core.Response> {
        return await this.db.put(doc);
    }

    async get(id: string): Promise<any> {
        return await this.db.get(id);
    }

    async allDocs(options?: PouchDB.Core.AllDocsOptions): Promise<PouchDB.Core.AllDocsResponse<{}>> {
        return await this.db.allDocs(options);
    }

    async bulkDocs(docs: any[], options?: PouchDB.Core.BulkDocsOptions): Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[]> {
        return await this.db.bulkDocs(docs, options);
    }

    async remove(doc: any): Promise<PouchDB.Core.Response> {
        return await this.db.remove(doc);
    }

    async closeDatabase(): Promise<void> {
        try {
            await this.db.close();
            console.log(`Database ${this.db.name} closed successfully.`);
        } catch (error) {
            console.error(`Error closing database ${this.db.name}:`, error);
            throw new Error(`Error closing database ${this.db.name}: ${error}`);
        }
    }

    async deleteDatabase(): Promise<void> {
        try {
            
            await this.db.destroy();
            console.log(`Database ${this.db.name} closed successfully.`);
        } catch (error) {
            console.error(`Error deleting database ${this.db.name}:`, error);
            throw new Error(`Error deleting database ${this.db.name}: ${error}`);
        }
    }

}
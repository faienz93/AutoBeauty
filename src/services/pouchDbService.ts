import { Capacitor } from '@capacitor/core';
import * as PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
// PouchDB.plugin(cordovaSqlitePlugin);


export interface PouchDbInfo extends PouchDB.Core.DatabaseInfo {
    /** Name of the database you gave when you called new PouchDB(), and also the unique identifier for the database. */
    db_name: string;

    /** Total number of non-deleted documents in the database. */
    doc_count: number;

    /** Sequence number of the database. It starts at 0 and gets incremented every time a document is added or modified */
    update_seq: number | string;
}


export interface IPouchDbService {
    getPlatform(): string;
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

class PouchDbService implements IPouchDbService {
    
    private platform = Capacitor.getPlatform();
    private db!: PouchDB.Database;
    private static instance: PouchDbService | null = null;
    private dbName: string;
   

    getPlatform(): string {
        return this.platform;
    }

    private constructor(dbName: string){
        this.dbName = dbName;
        if (this.platform === 'web') {
            this.db = new PouchDB(dbName);
        } else {
            PouchDB.plugin(cordovaSqlitePlugin);
            this.db = new PouchDB(dbName, {adapter: 'cordova-sqlite'});
        }
    }


    public static getInstance(dbName: string): PouchDbService {
        if (!PouchDbService.instance) {
            PouchDbService.instance = new PouchDbService(dbName);
        }
        return PouchDbService.instance;
    }

    async getInfo(): Promise<PouchDbInfo> {

        try {
            return await this.db.info() as PouchDbInfo;
            
        }catch (error) {
            console.error('Error getting database info:', error);
            throw new Error(`Error getting database info: ${error}`);
        }
        
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
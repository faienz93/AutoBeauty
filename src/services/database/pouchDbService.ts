import { Capacitor } from '@capacitor/core';
import PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import PouchFind from 'pouchdb-find';
import { PouchDbType } from '../../models/PouchDbType';
PouchDB.plugin(PouchFind);
PouchDB.plugin(cordovaSqlitePlugin);

export interface PouchDbInfo extends PouchDB.Core.DatabaseInfo {
  db_name: string;
  doc_count: number;
  update_seq: number | string;
}

export interface IPouchDbService {
  getInfo(): Promise<PouchDbInfo>;
  closeDatabase(): Promise<void>;
  deleteDatabase(): Promise<void>;
  put(doc: any): Promise<PouchDB.Core.Response>;
  get(id: string): Promise<any>;
  allDocs(options?: PouchDB.Core.AllDocsOptions): Promise<PouchDB.Core.AllDocsResponse<{}>>;
  bulkDocs(docs: any[], options?: PouchDB.Core.BulkDocsOptions): Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[]>;
  remove(doc: any): Promise<PouchDB.Core.Response>;
  find<T extends {}>(query: PouchDB.Find.FindRequest<T>): Promise<PouchDB.Find.FindResponse<T>>;
}

export abstract class PouchDbService implements IPouchDbService {
  private platform = Capacitor.getPlatform();
  protected db!: PouchDB.Database;
  private dbName: string;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.initDatabase();
  }

  private initDatabase() {
    // if (this.platform === 'web') {
    //     console.log('Web platform detected. Using default PouchDB adapter.');
    //     this.db = new PouchDB(this.dbName);
    // } else if ( this.platform === 'android') {
    //     console.log('ANDROID - Cordova platform detected. Using cordova-sqlite adapter.');
    //     this.db = new PouchDB(this.dbName, { adapter: 'cordova-sqlite', location: 'default' });
    // } else if(this.platform === 'ios' ) {
    //     console.log('IOS - Cordova platform detected. Using cordova-sqlite adapter.');
    //     this.db = new PouchDB(this.dbName, { adapter: 'cordova-sqlite', iosDatabaseLocation: 'default' });
    // }

    this.db = new PouchDB(this.dbName);

    this.createSpecificIndexes();
  }

  protected abstract createSpecificIndexes(): Promise<void>;

  async getInfo(): Promise<PouchDbInfo> {
    try {
      return (await this.db.info()) as PouchDbInfo;
    } catch (error) {
      console.error('Error getting database info:', error);
      throw new Error(`Error getting database info: ${error}`);
    }
  }

  async put(doc: PouchDbType): Promise<PouchDB.Core.Response> {
    try {
      return await this.db.put(doc);
    } catch (error) {
      console.error('Error putting document:', error);
      throw new Error(`Error putting document: ${error}`);
    }
  }

  async get(id: string): Promise<any> {
    try {
      return await this.db.get(id);
    } catch (error) {
      // console.error(`Error getting document with id ${id}:`, error);
      // throw new Error(`Error getting document with id ${id}: ${error}`);
      console.log(`Error getting document with id ${id}:`, error);
    }
  }

  async allDocs(options?: PouchDB.Core.AllDocsOptions): Promise<PouchDB.Core.AllDocsResponse<{}>> {
    try {
      return await this.db.allDocs(options);
    } catch (error) {
      console.error('Error getting all documents:', error);
      throw new Error(`Error getting all documents: ${error}`);
    }
  }

  async bulkDocs(docs: any[], options?: PouchDB.Core.BulkDocsOptions): Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[]> {
    try {
      return await this.db.bulkDocs(docs, options);
    } catch (error) {
      console.error('Error performing bulk document operations:', error);
      throw new Error(`Error performing bulk document operations: ${error}`);
    }
  }

  async remove(doc: any): Promise<PouchDB.Core.Response> {
    try {
      return await this.db.remove(doc);
    } catch (error) {
      console.error('Error removing document:', error);
      throw new Error(`Error removing document: ${error}`);
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

      this.initDatabase();
    } catch (error) {
      console.error(`Error deleting database ${this.db.name}:`, error);
      throw new Error(`Error deleting database ${this.db.name}: ${error}`);
    }
  }

  async find<T extends {}>(query: PouchDB.Find.FindRequest<T>): Promise<PouchDB.Find.FindResponse<T>> {
    try {
      if (!this.db.find) {
        throw new Error('PouchDB find plugin not initialized');
      }
      return (await this.db.find(query)) as PouchDB.Find.FindResponse<T>;
    } catch (error) {
      console.error('Error running find query:', error);
      throw new Error(`Error running find query: ${error}`);
    }
  }
}

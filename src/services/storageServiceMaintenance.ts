import { platform } from '../App';
import { BehaviorSubject } from 'rxjs';
import { ISQLiteService } from './sqliteService';
import { IDbVersionService } from './dbVersionService';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { UserUpgradeStatements } from '../upgrades/user.upgrade.statements';
import { User } from '../models/user';
import { getEnv } from './env';
import { Maintenance } from '../models/Maintenance';

const envVar = getEnv();

export interface IStorageServiceMaintenance {
    initializeDatabase(): Promise<void>
    getMaintenance(): Promise<Maintenance[]>
    addMaintenance(user: Maintenance): Promise<number>
    updateMaintenanceById(maintenance: Maintenance): Promise<void>
    deleteMaintenanceById(id: string): Promise<void>
    getDatabaseName(): string
    getDatabaseVersion(): number
};
class StorageServiceMaintenance implements IStorageServiceMaintenance {
    versionUpgrades = UserUpgradeStatements;
    loadToVersion = UserUpgradeStatements[UserUpgradeStatements.length - 1].toVersion;
    db!: SQLiteDBConnection;
    database: string = envVar?.sqlitedb;
    sqliteServ!: ISQLiteService;
    dbVerServ!: IDbVersionService;
    isInitCompleted = new BehaviorSubject(false);

    constructor(sqliteService: ISQLiteService, dbVersionService: IDbVersionService) {
        this.sqliteServ = sqliteService;
        this.dbVerServ = dbVersionService;
    }

    getDatabaseName(): string {
        return this.database;
    }
    getDatabaseVersion(): number {
        return this.loadToVersion;
    }
    async initializeDatabase(): Promise<void> {
        // create upgrade statements
        try {
            await this.sqliteServ.addUpgradeStatement({
                database: this.database,
                upgrade: this.versionUpgrades
            });
            this.db = await this.sqliteServ.openDatabase(this.database, this.loadToVersion, false);
            const isData = await this.db.query("select * from sqlite_sequence");
            console.log("IS DATA")
            console.log(isData)
            if (isData.values!.length === 0) {
                // create database initial users if any

            }

            this.dbVerServ.setDbVersion(this.database, this.loadToVersion);
            if (platform === 'web') {
                await this.sqliteServ.saveToStore(this.database);
            }
            this.isInitCompleted.next(true);
        } catch (error: any) {
            const msg = error.message ? error.message : error;
            throw new Error(`storageService.initializeDatabase: ${msg}`);
        }
    }
    async getMaintenance(): Promise<Maintenance[]> {
        return (await this.db.query(`SELECT * FROM ${envVar?.car_table};`)).values as Maintenance[];
    }
    async addMaintenance(maintenance: Maintenance): Promise<number> {
        const sql = `INSERT INTO ${envVar?.user_table} (id, data, km, tipo, costo, note) VALUES (?);`;
        const res = await this.db.run(sql, [
            maintenance.id,
            maintenance.data,
            maintenance.km,
            maintenance.tipo,
            maintenance.costo,
            maintenance.note,
        ]);
        if (res.changes !== undefined
            && res.changes.lastId !== undefined && res.changes.lastId > 0) {
            return res.changes.lastId;
        } else {
            throw new Error(`storageService.addMaintenance: lastId not returned`);
        }
    }

    async updateMaintenanceById(maintenance: Maintenance): Promise<void> {
        const sql = `UPDATE ${envVar?.car_table} 
                     SET data = ${maintenance.data}, km = ${maintenance.km}, tipo = ${maintenance.tipo}, costo = ${maintenance.costo}, note = ${maintenance.note}
                     WHERE id = ${maintenance.id};`;
        await this.db.run(sql);
    }
    async deleteMaintenanceById(id: string): Promise<void> {
        const sql = `DELETE FROM ${envVar?.car_table} WHERE id=${id}`;
        await this.db.run(sql);
    }

}
export default StorageServiceMaintenance;
import { getEnv } from '../services/env';

const envVar = getEnv();


export const CarUpgradeStatements = [
    {
    toVersion: 1,
    // Importante mettere almeno una chiave primaria autoincrement altrimenti darà errore in fase di creazione delle tabella, perchè non crea sqlite_sequence
    statements: [
        `CREATE TABLE IF NOT EXISTS ${envVar?.car_table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        data TEXT NOT NULL,
        km INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        costo REAL NOT NULL,
        note TEXT
        );`
    ]
    },
    /* add new statements below for next database version when required*/
    /*
    {
    toVersion: 2,
    statements: [
        `ALTER TABLE ${envVar?.table} ADD COLUMN email TEXT;`,
    ]
    },
    */
]
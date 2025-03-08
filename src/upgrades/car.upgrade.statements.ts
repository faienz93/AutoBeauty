import { getEnv } from '../services/env';

const envVar = getEnv();


export const UserUpgradeStatements = [
    {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS ${envVar?.table} (
        id TEXT PRIMARY KEY NOT NULL,
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
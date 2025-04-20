import { getEnv } from '../services/env';

const envVar = getEnv();

export const UserUpgradeStatements = [
    {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS ${envVar?.user_table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        active INTEGER DEFAULT 1
        );`
    ]
    },
    /* add new statements below for next database version when required*/
    /*
    {
    toVersion: 2,
    statements: [
        `ALTER TABLE ${envVar?.user_table} ADD COLUMN email TEXT;`,
    ]
    },
    */
]
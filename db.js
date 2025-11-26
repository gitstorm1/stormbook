import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve a default path for the SQLite database file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultDbPath = path.join(__dirname, 'stormbook.sqlite3');
const dbFilePath = process.env.DB_FILE || defaultDbPath;

sqlite3.verbose();

const rawDb = new sqlite3.Database(dbFilePath);

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        rawDb.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        rawDb.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        rawDb.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// Provide a minimal pg-promise-like interface so the rest of the code
// can stay the same: one, oneOrNone, manyOrNone, none.
export const db = {
    async one(sql, params = []) {
        const row = await get(sql, params);
        if (!row) {
            throw new Error('db.one: no row returned');
        }
        return row;
    },

    async oneOrNone(sql, params = []) {
        const row = await get(sql, params);
        return row || null;
    },

    async manyOrNone(sql, params = []) {
        const rows = await all(sql, params);
        return rows || [];
    },

    async none(sql, params = []) {
        await run(sql, params);
    },

    // Expose the underlying sqlite3 Database instance in case it is ever needed.
    raw: rawDb,
};



import PGP from 'pg-promise';

import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const pgp = PGP();

const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

export function createSessionMiddleware() {
    return expressSession({
        secret: process.env.SESSION_SECRET,
        
        resave: false,
        saveUninitialized: false,
    
        store: new ( connectPgSimple(expressSession) ) ({
            pgPromise: db,
        }),
    
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        },
    });
}

export async function getAccountIdAndHashFromEmail(email) {
    return await db.oneOrNone('SELECT id, pwd_hash FROM users WHERE email=$1 LIMIT 1', [email]);
}
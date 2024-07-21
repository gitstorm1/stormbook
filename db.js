import dotenv from 'dotenv';
dotenv.config();

import PGP from 'pg-promise';

const pgp = PGP();

export const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});


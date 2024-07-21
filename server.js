"use strict";

import dotenv from 'dotenv';
import path from 'path';
import { __public } from './config.js';

import express from 'express';

import PGP from 'pg-promise';
import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();

const pgp = PGP();
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

app.use('/assets', express.static(path.join(__public, 'assets'), { index: false, }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        
        resave: false,
        saveUninitialized: false,

        store: new ( connectPgSimple(expressSession) ) ({
            pgPromise: db,
        }),

        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

(async () => {
    app.get('/sign-up', (await import('./routes/GET/sign-up.js')).default);
    app.post('/sign-up', (await import('./routes/POST/sign-up.js')).default);
    
    app.get('/login', (await import('./routes/GET/login.js')).default);
    app.post('/login', (await import('./routes/POST/login.js')).default);

    app.post('/logout', (await import('./routes/POST/logout.js')).default);

    app.get('/', (await import('./routes/GET/root.js')).default);
})();

app.listen(process.env.PORT, 'localhost', () => {
    console.log(`The server is now listening at port ${process.env.PORT}`);
});
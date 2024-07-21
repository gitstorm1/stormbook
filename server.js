"use strict";

import { __public } from './config.js';
import path from 'path';

import express from 'express';

import { db } from './db.js'
import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const app = express();

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
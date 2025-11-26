"use strict";

import dotenv from 'dotenv';
dotenv.config()

import { __public } from './config.js';
import path from 'path';

import express from 'express';

import expressSession from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

import apiModule from './users/api/index.js';
import usersModule from './users/index.js';

const app = express();

const SQLiteStore = connectSqlite3(expressSession);

app.use('/assets', express.static(path.join(__public, 'assets'), { index: false, }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        
        resave: false,
        saveUninitialized: false,

        store: new SQLiteStore({
            db: process.env.SESSION_DB_FILE || 'sessions.sqlite3',
        }),

        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

//app.use('/api', (await import('./routes/GET/api/api.js')).default);
//app.use('/api', (await import('./routes/POST/api.js')).default);

await apiModule.initialize(app);

await usersModule.initialize(app);

app.get('/', (await import('./routes/GET/root.js')).default);

app.listen(process.env.PORT, 'localhost', () => {
    console.log(`The server is now listening at port ${process.env.PORT}`);
});